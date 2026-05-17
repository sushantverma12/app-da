import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import {
  resolveVideoForDisaster,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from '@/constants/disasterVideos';
import { Colors, radius } from '@/constants/theme';

interface Props {
  disasterId: string;
  firestoreVideoUrl?: string;
}

export function DisasterVideoLesson({ disasterId, firestoreVideoUrl }: Props) {
  const lesson = resolveVideoForDisaster(disasterId, firestoreVideoUrl);
  const [loading, setLoading] = useState(true);

  if (!lesson) {
    return (
      <View style={styles.card} testID="video-lesson-empty">
        <Feather name="film" size={24} color={Colors.textSecondary} />
        <Text style={styles.emptyText}>Video lesson coming soon for this module.</Text>
      </View>
    );
  }

  const thumb = `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`;
  const embed = youtubeEmbedUrl(lesson.youtubeId);

  const openExternal = () => {
    void WebBrowser.openBrowserAsync(youtubeWatchUrl(lesson.youtubeId));
  };

  return (
    <View style={styles.card} testID="video-lesson">
      <Text style={styles.h2}>Video lesson</Text>
      <Text style={styles.meta}>
        {lesson.durationLabel} · {lesson.source}
      </Text>
      <Text style={styles.videoTitle}>{lesson.title}</Text>

      {Platform.OS === 'web' ? (
        <Pressable onPress={openExternal} style={styles.thumbWrap}>
          <Image source={{ uri: thumb }} style={styles.thumb} resizeMode="cover" />
          <View style={styles.playOverlay}>
            <Feather name="play-circle" size={48} color={Colors.white} />
            <Text style={styles.playText}>Watch on YouTube</Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.playerWrap}>
          {loading ? (
            <ActivityIndicator style={styles.loader} color={Colors.primaryBlue} />
          ) : null}
          <WebView
            source={{ uri: embed }}
            style={styles.webview}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
      )}

      <Pressable testID="open-video-external" style={styles.linkBtn} onPress={openExternal}>
        <Feather name="external-link" size={16} color={Colors.primaryBlue} />
        <Text style={styles.linkText}>Open in YouTube</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    gap: 8,
  },
  h2: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  meta: { fontSize: 12, color: Colors.textSecondary },
  videoTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.button,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  loader: { position: 'absolute', alignSelf: 'center', top: '40%', zIndex: 1 },
  thumbWrap: { borderRadius: radius.button, overflow: 'hidden', position: 'relative' },
  thumb: { width: '100%', aspectRatio: 16 / 9 },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playText: { color: Colors.white, fontWeight: '700' },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  linkText: { color: Colors.primaryBlue, fontWeight: '600', fontSize: 14 },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', marginTop: 8 },
});
