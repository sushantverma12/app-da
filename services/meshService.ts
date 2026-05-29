import Constants from 'expo-constants';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  Strategy,
  acceptConnection,
  disconnect,
  isPlayServicesAvailable,
  onConnected,
  onDisconnected,
  onInvitationReceived,
  onPeerFound,
  onPeerLost,
  onTextReceived,
  requestConnection,
  sendText,
  startAdvertise,
  startDiscovery,
  stopAdvertise,
  stopDiscovery,
  type Unsubscribe,
} from 'expo-nearby-connections';

export type MeshPeer = {
  id: string;
  name: string;
  signal: 'strong' | 'medium' | 'weak';
};

export type MeshMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  self: boolean;
};

type StartMeshOptions = {
  deviceName?: string;
  onPeerUpdate?: (peers: MeshPeer[]) => void;
  onConnectedChange?: (connected: boolean) => void;
  onMessage?: (message: MeshMessage) => void;
  onStatus?: (status: string) => void;
};

type MeshPacket = {
  type: 'appda.mesh.text';
  v: 1;
  id: string;
  originId: string;
  senderName: string;
  text: string;
  createdAt: number;
  ttl: number;
};

const MAX_TTL = 8;
const MESSAGE_TYPE = 'appda.mesh.text';

const connectedPeers = new Map<string, MeshPeer>();
const discoveredPeers = new Map<string, MeshPeer>();
const connectingPeers = new Set<string>();
const seenPackets = new Set<string>();
let connectionWaiters: Array<() => void> = [];
let subscriptions: Unsubscribe[] = [];
let options: StartMeshOptions = {};
let localNodeId = makeLocalNodeId();
let localNearbyPeerId: string | null = null;
let localDeviceName = 'App-da Phone';
let started = false;

function makeLocalNodeId() {
  return `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function uniquePacketId() {
  return `${localNodeId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDeviceName(name?: string) {
  const constantName = typeof Constants.deviceName === 'string' ? Constants.deviceName : '';
  return (name || constantName || 'App-da Phone').slice(0, 48);
}

function emitPeers() {
  const peers = new Map(discoveredPeers);
  connectedPeers.forEach((peer, id) => peers.set(id, peer));
  options.onPeerUpdate?.([...peers.values()]);
  options.onConnectedChange?.(connectedPeers.size > 0);
}

function upsertPeer(peer: MeshPeer, connected = false) {
  if (connected) {
    connectedPeers.set(peer.id, { ...peer, signal: 'strong' });
    discoveredPeers.delete(peer.id);
    connectionWaiters.forEach((resolve) => resolve());
    connectionWaiters = [];
  } else if (!connectedPeers.has(peer.id)) {
    discoveredPeers.set(peer.id, peer);
  }
  emitPeers();
}

function removePeer(peerId: string) {
  discoveredPeers.delete(peerId);
  connectedPeers.delete(peerId);
  connectingPeers.delete(peerId);
  emitPeers();
}

async function requestAndroidPermissions() {
  if (Platform.OS !== 'android') return;

  const permissions = [
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
  ].filter(Boolean) as string[];

  const result = (await PermissionsAndroid.requestMultiple(permissions as any)) as Record<string, string>;
  const denied = permissions.filter((permission) => result[permission] !== PermissionsAndroid.RESULTS.GRANTED);

  if (denied.length > 0) {
    throw new Error('Nearby permissions were denied. Enable Nearby devices, Bluetooth, Wi-Fi, and Location permissions.');
  }
}

async function connectToPeer(peerId: string) {
  if (connectingPeers.has(peerId) || connectedPeers.has(peerId)) return;

  connectingPeers.add(peerId);
  try {
    await requestConnection(peerId);
  } catch (error) {
    connectingPeers.delete(peerId);
    options.onStatus?.(error instanceof Error ? error.message : 'Unable to connect to nearby peer.');
  }
}

function waitForConnection(timeoutMs = 8000) {
  if (connectedPeers.size > 0) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      connectionWaiters = connectionWaiters.filter((waiter) => waiter !== done);
      reject(new Error('No nearby devices are fully connected yet. Wait for Connected, then try again.'));
    }, timeoutMs);

    const done = () => {
      clearTimeout(timer);
      resolve();
    };

    connectionWaiters.push(done);
  });
}

async function forwardPacket(packet: MeshPacket, receivedFromPeerId?: string) {
  if (packet.ttl <= 0) return 0;

  const targetPeerIds = [...connectedPeers.keys()].filter((peerId) => peerId !== receivedFromPeerId);
  if (targetPeerIds.length === 0) return 0;

  const forwarded = JSON.stringify({ ...packet, ttl: packet.ttl - 1 });
  const results = await Promise.allSettled(targetPeerIds.map((peerId) => sendText(peerId, forwarded)));
  const deliveredCount = results.filter((result) => result.status === 'fulfilled').length;
  const failed = results.find((result) => result.status === 'rejected');

  if (deliveredCount === 0 && failed?.status === 'rejected') {
    const reason = failed.reason;
    throw new Error(reason instanceof Error ? reason.message : 'Unable to deliver message to nearby peer.');
  }

  return deliveredCount;
}

async function handleIncomingText(peerId: string, rawText: string) {
  let packet: MeshPacket | null = null;

  try {
    const parsed = JSON.parse(rawText) as Partial<MeshPacket>;
    if (parsed.type === MESSAGE_TYPE && parsed.id && parsed.originId && parsed.text) {
      packet = parsed as MeshPacket;
    }
  } catch {
    packet = null;
  }

  if (!packet) {
    options.onMessage?.({
      id: `raw-${peerId}-${Date.now()}`,
      sender: connectedPeers.get(peerId)?.name || 'Nearby device',
      text: rawText,
      time: now(),
      self: false,
    });
    return;
  }

  if (seenPackets.has(packet.id)) return;

  seenPackets.add(packet.id);
  if (packet.originId !== localNodeId) {
    options.onMessage?.({
      id: packet.id,
      sender: packet.senderName || connectedPeers.get(peerId)?.name || 'Nearby device',
      text: packet.text,
      time: now(),
      self: false,
    });
  }

  await forwardPacket(packet, peerId);
}

export async function startMeshService(startOptions: StartMeshOptions = {}) {
  if (started) {
    options = { ...options, ...startOptions };
    emitPeers();
    return;
  }

  options = startOptions;
  localDeviceName = getDeviceName(startOptions.deviceName);
  await requestAndroidPermissions();

  if (Platform.OS === 'android') {
    const playServicesAvailable = await isPlayServicesAvailable();
    if (!playServicesAvailable) {
      throw new Error('Google Play services are required for Nearby Connections on Android.');
    }
  }

  subscriptions = [
    onPeerFound((peer) => {
      upsertPeer({ id: peer.peerId, name: peer.name || 'Nearby device', signal: 'medium' });
      void connectToPeer(peer.peerId);
    }),
    onPeerLost(({ peerId }) => {
      if (!connectedPeers.has(peerId)) removePeer(peerId);
    }),
    onInvitationReceived(({ peerId, name }) => {
      upsertPeer({ id: peerId, name: name || 'Nearby device', signal: 'medium' });
      void acceptConnection(peerId).catch((error) => {
        options.onStatus?.(error instanceof Error ? error.message : 'Unable to accept nearby connection.');
      });
    }),
    onConnected((peer) => {
      connectingPeers.delete(peer.peerId);
      upsertPeer({ id: peer.peerId, name: peer.name || 'Nearby device', signal: 'strong' }, true);
      options.onStatus?.('Connected to nearby mesh.');
    }),
    onDisconnected(({ peerId }) => {
      removePeer(peerId);
      options.onStatus?.('A nearby device disconnected.');
    }),
    onTextReceived(({ peerId, text }) => {
      void handleIncomingText(peerId, text);
    }),
  ];

  const [advertiseId, discoveryId] = await Promise.all([
    startAdvertise(localDeviceName, Strategy.P2P_CLUSTER),
    startDiscovery(localDeviceName, Strategy.P2P_CLUSTER),
  ]);

  localNearbyPeerId = advertiseId || discoveryId;
  started = true;
  options.onStatus?.('Scanning and advertising for nearby mesh devices.');
}

export async function joinMesh() {
  await Promise.allSettled([...discoveredPeers.keys()].map((peerId) => connectToPeer(peerId)));
  await waitForConnection();
  emitPeers();
}

export async function sendMeshMessage(text: string): Promise<MeshMessage> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Message is empty.');

  const packet: MeshPacket = {
    type: MESSAGE_TYPE,
    v: 1,
    id: uniquePacketId(),
    originId: localNodeId,
    senderName: localDeviceName,
    text: trimmed,
    createdAt: Date.now(),
    ttl: MAX_TTL,
  };

  seenPackets.add(packet.id);
  await waitForConnection();
  const deliveredCount = await forwardPacket(packet);
  if (deliveredCount === 0) {
    seenPackets.delete(packet.id);
    throw new Error('No nearby devices are fully connected yet. Wait for Connected, then try again.');
  }

  return {
    id: packet.id,
    sender: 'You',
    text: trimmed,
    time: now(),
    self: true,
  };
}

export async function stopMeshService() {
  subscriptions.forEach((unsubscribe) => unsubscribe());
  subscriptions = [];
  connectingPeers.clear();
  connectedPeers.clear();
  discoveredPeers.clear();
  seenPackets.clear();
  connectionWaiters.forEach((resolve) => resolve());
  connectionWaiters = [];
  started = false;
  localNearbyPeerId = null;
  localNodeId = makeLocalNodeId();
  await Promise.allSettled([stopDiscovery(), stopAdvertise(), disconnect()]);
  emitPeers();
}

export function getMeshState() {
  return {
    connected: connectedPeers.size > 0,
    localPeerId: localNearbyPeerId,
    peers: [...new Map([...discoveredPeers, ...connectedPeers]).values()],
  };
}
