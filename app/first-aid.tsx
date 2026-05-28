import { useState } from 'react';
import { ActivityIndicator, Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { WebView } from 'react-native-webview';
import { ScreenShell } from '@/components/ScreenShell';
import { Colors, radius } from '@/constants/theme';

const MODULES = [
  {
    id: 'stretcher',
    title: 'Stretcher',
    icon: 'maximize-2' as const,
    videoUrl: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779981997/strecher_av9w7s.mp4',
  },
  {
    id: 'bandage',
    title: 'Bandage',
    icon: 'plus-square' as const,
    videoUrl: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779981977/bandage_rw65sl.mp4',
  },
  {
    id: 'cpr',
    title: 'CPR',
    icon: 'activity' as const,
    videoUrl: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779981981/CPR_ipibyg.mp4',
  },
  {
    id: 'ors',
    title: 'ORS',
    icon: 'droplet' as const,
    videoUrl: 'https://res.cloudinary.com/dgrtsjmso/video/upload/q_auto/f_auto/v1779981973/ORS_lwddpq.mp4',
  },
  { id: 'smoke', title: 'Smoke Safety', icon: 'wind' as const },
  { id: 'flood-tools', title: 'Flood Tools', icon: 'tool' as const },
  { id: 'torch', title: 'Torch', icon: 'sun' as const },
  { id: 'water', title: 'Clean Water', icon: 'filter' as const },
  { id: 'head-protection', title: 'Head Cover', icon: 'hard-drive' as const },
  { id: 'rope', title: 'Escape Rope', icon: 'link' as const },
  { id: 'signal', title: 'Sound Signal', icon: 'volume-2' as const },
  { id: 'shelter', title: 'Shelter', icon: 'home' as const },
  { id: 'splint', title: 'Splint', icon: 'shield' as const },
  { id: 'heatstroke', title: 'Heatstroke', icon: 'thermometer' as const },
  { id: 'sling', title: 'Arm Sling', icon: 'heart' as const },
];

export default function FirstAidScreen() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof MODULES)[number] | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const openVideo = (module: (typeof MODULES)[number]) => {
    if (!module.videoUrl) return;
    setLoadingVideo(true);
    setSelectedVideo(module);
  };

  return (
    <ScreenShell testID="first-aid-screen">
      <Stack.Screen options={{ headerShown: true, title: 'First Aid' }} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Feather name="heart" size={30} color={Colors.dangerRed} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.title}>First Aid</Text>
          <Text style={styles.sub}>Offline lessons for quick medical response.</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>MODULES</Text>
      <View style={styles.moduleGrid}>
        {MODULES.map((module) => (
          <Pressable
            key={module.id}
            style={styles.module}
            testID={`first-aid-${module.id}`}
            onPress={() => openVideo(module)}
            disabled={!module.videoUrl}
          >
            <View style={styles.moduleIcon}>
              <Feather name={module.icon} size={20} color={Colors.primaryBlue} />
            </View>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={module.videoUrl ? styles.play : styles.soon}>
              {module.videoUrl ? 'Play video' : 'Soon'}
            </Text>
          </Pressable>
        ))}
      </View>
      <Modal
        visible={Boolean(selectedVideo)}
        animationType="slide"
        onRequestClose={() => setSelectedVideo(null)}
        presentationStyle="fullScreen"
      >
        <View style={styles.playerScreen}>
          <View style={styles.playerHeader}>
            <Pressable style={styles.closeBtn} onPress={() => setSelectedVideo(null)}>
              <Feather name="x" size={24} color={Colors.textPrimary} />
            </Pressable>
            <Text style={styles.playerTitle}>{selectedVideo?.title}</Text>
          </View>
          <View style={styles.playerWrap}>
            {loadingVideo ? (
              <ActivityIndicator style={styles.loader} color={Colors.primaryBlue} size="large" />
            ) : null}
            {selectedVideo?.videoUrl ? (
              <WebView
                source={{ html: videoHtml(selectedVideo.videoUrl) }}
                style={styles.webview}
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction={false}
                onLoadEnd={() => setLoadingVideo(false)}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

function videoHtml(url: string) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: #000;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
          }
        </style>
      </head>
      <body>
        <video controls autoplay playsinline preload="metadata" src="${url}"></video>
      </body>
    </html>
  `;
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F4',
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F7D6D3',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginRight: 14,
  },
  heroText: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  module: {
    width: '48%',
    minHeight: 112,
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    justifyContent: 'space-between',
  },
  moduleIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FE',
  },
  moduleTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  soon: { alignSelf: 'flex-start', fontSize: 11, color: Colors.textSecondary, fontWeight: '800' },
  play: { alignSelf: 'flex-start', fontSize: 11, color: Colors.primaryBlue, fontWeight: '800' },
  playerScreen: { flex: 1, backgroundColor: Colors.bgLight, padding: 16 },
  playerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  playerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  loader: { position: 'absolute', alignSelf: 'center', top: '42%', zIndex: 1 },
});
