import { Alert, Platform, Share } from 'react-native';
import { Drill } from '@/types';

function csvCell(value: string | number) {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function formatDate(value?: Date) {
  if (!value) return '';
  return new Date(value).toLocaleString();
}

export function drillElapsedSeconds(drill: Drill, value: Date) {
  const elapsedMs = new Date(value).getTime() - new Date(drill.startedAt).getTime();
  return Math.max(0, Math.floor(elapsedMs / 1000));
}

export function formatDrillElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function drillCheckInCsv(drill: Drill) {
  const rankedCheckIns = [...(drill.checkIns ?? [])].sort(
    (a, b) => drillElapsedSeconds(drill, a.checkedInAt) - drillElapsedSeconds(drill, b.checkedInAt)
  );
  const rows = [
    ['Rank', 'Name', 'Completion time', 'Logged at'],
    ...rankedCheckIns.map((entry, index) => [
      index + 1,
      entry.name,
      formatDrillElapsed(drillElapsedSeconds(drill, entry.checkedInAt)),
      formatDate(entry.checkedInAt),
    ]),
  ];

  const summary = [
    [''],
    ['Drill summary'],
    ['Disaster', drill.disasterType],
    ['Started', formatDate(drill.startedAt)],
    ['Expected', drill.expectedCount],
    ['Checked in', drill.checkedInCount],
    ['Anonymous', drill.anonymousCount],
  ];

  return [...rows, ...summary].map((row) => row.map(csvCell).join(',')).join('\n');
}

export async function exportDrillCheckIns(drill: Drill) {
  const csv = drillCheckInCsv(drill);
  const fileName = `app-da-${drill.disasterType}-drill-${new Date(drill.startedAt)
    .toISOString()
    .slice(0, 10)}.csv`;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  try {
    await Share.share({
      title: fileName,
      message: csv,
    });
  } catch {
    Alert.alert('Export failed', 'Could not open the share sheet.');
  }
}
