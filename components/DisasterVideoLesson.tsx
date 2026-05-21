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

  const thumb =
    lesson.kind === 'youtube' && lesson.youtubeId
      ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`
      : null;
  const playerUrl =
    lesson.kind === 'youtube' && lesson.youtubeId ? youtubeEmbedUrl(lesson.youtubeId) : lesson.url;

  const openExternal = () => {
    const url =
      lesson.kind === 'youtube' && lesson.youtubeId ? youtubeWatchUrl(lesson.youtubeId) : lesson.url;
    void WebBrowser.openBrowserAsync(url);
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
          {thumb ? (
            <Image source={{ uri: thumb }} style={styles.thumb} resizeMode="cover" />
          ) : (
            <View style={styles.directVideoPreview}>
              <Feather name="video" size={42} color={Colors.white} />
            </View>
          )}
          <View style={styles.playOverlay}>
            <Feather name="play-circle" size={48} color={Colors.white} />
            <Text style={styles.playText}>
              {lesson.kind === 'youtube' ? 'Watch on YouTube' : 'Play video'}
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.playerWrap}>
          {loading ? (
            <ActivityIndicator style={styles.loader} color={Colors.primaryBlue} />
          ) : null}
          <WebView
            source={
              lesson.kind === 'direct'
                ? { html: directVideoHtml(playerUrl) }
                : { uri: playerUrl }
            }
            style={styles.webview}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
      )}

      <Pressable testID="open-video-external" style={styles.linkBtn} onPress={openExternal}>
        <Feather name="external-link" size={16} color={Colors.primaryBlue} />
        <Text style={styles.linkText}>
          {lesson.kind === 'youtube' ? 'Open in YouTube' : 'Open video'}
        </Text>
      </Pressable>
    </View>
  );
}

function directVideoHtml(url: string): string {
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
        <video controls playsinline preload="metadata" src="${url}"></video>
      </body>
    </html>
  `;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    gap: 8,
  },
  directVideoPreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
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
