import { View, Text, StyleSheet, Pressable, Share, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors, radius } from '@/constants/theme';

interface Props {
  schoolCode: string;
  qrData: string;
  schoolName?: string;
}

export function QRCard({ schoolCode, qrData, schoolName }: Props) {
  return (
    <View style={styles.card} testID="qr-card">
      {schoolName ? <Text style={styles.school}>{schoolName}</Text> : null}
      <Text style={styles.label}>School Code</Text>
      <Text style={styles.code} testID="school-code-display">
        {schoolCode}
      </Text>
      <View style={styles.qrWrap}>
        <QRCode value={qrData} size={180} />
      </View>
      <Text style={styles.hint}>Print this QR and place it at your assembly point.</Text>
      <Pressable
        testID="share-qr-link"
        style={styles.shareBtn}
        onPress={async () => {
          try {
            await Share.share({
              message: `App-da assembly check-in\nSchool: ${schoolCode}\n${qrData}`,
              title: 'App-da check-in link',
            });
          } catch {
            Alert.alert('Could not share link');
          }
        }}
      >
        <Text style={styles.shareText}>Share check-in link</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  school: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  label: { fontSize: 13, color: Colors.textSecondary },
  code: { fontSize: 32, fontWeight: '800', color: Colors.primaryBlue, letterSpacing: 4 },
  qrWrap: { padding: 16, marginVertical: 8 },
  hint: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  shareBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  shareText: { color: Colors.primaryBlue, fontWeight: '600', fontSize: 14 },
});
