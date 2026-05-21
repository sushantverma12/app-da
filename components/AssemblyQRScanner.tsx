import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { parseSchoolFromQrData } from '@/services/deepLinks';
import { Colors, radius } from '@/constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  expectedSchoolCode: string;
  onSuccess: (qrData: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export function AssemblyQRScanner({
  title,
  subtitle,
  expectedSchoolCode,
  onSuccess,
  onCancel,
  disabled = false,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<string | null>(null);
  const scannedRef = useRef(false);
  const expected = expectedSchoolCode.toUpperCase();

  const onBarcodeScanned = ({ data }: { data: string }) => {
    if (disabled || scannedRef.current) return;
    const school = parseSchoolFromQrData(data);
    if (!school) {
      setError('Invalid QR. Scan your school assembly poster.');
      return;
    }
    if (school !== expected) {
      setError(`Wrong school QR. Expected ${expected}, got ${school}.`);
      return;
    }
    scannedRef.current = true;
    onSuccess(data);
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primaryBlue} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center} testID="qr-permission">
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>Camera access is required to scan the assembly QR poster.</Text>
        <Pressable style={styles.btn} onPress={() => void requestPermission()}>
          <Text style={styles.btnText}>Allow camera</Text>
        </Pressable>
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="qr-scanner">
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      <View style={styles.cameraWrap}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={disabled ? undefined : onBarcodeScanned}
        />
        <View style={styles.frame} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.hint}>Point at the assembly QR poster for school {expected}</Text>
      <Pressable style={styles.cancelBtn} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.bgLight },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: Colors.bgLight },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  cameraWrap: { flex: 1, maxHeight: 360, borderRadius: radius.card, overflow: 'hidden', marginBottom: 12 },
  camera: { flex: 1 },
  frame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    margin: 24,
    borderRadius: 12,
  },
  hint: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 12 },
  error: { fontSize: 14, color: Colors.dangerRed, textAlign: 'center', marginBottom: 8 },
  btn: {
    backgroundColor: Colors.primaryBlue,
    padding: 14,
    borderRadius: radius.button,
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  btnText: { color: Colors.white, fontWeight: '700' },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelText: { color: Colors.textSecondary, fontWeight: '600' },
});
