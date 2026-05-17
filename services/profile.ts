import { AppUser } from '@/types';
import { isFirebaseConfigured, updateUserProfile } from './firebase';
import { localUpdateProfile } from './localAuth';
import { useAuthStore } from '@/store/authStore';

export const BADGE_CATALOG: { id: string; label: string; icon: string }[] = [
  { id: 'first_quiz', label: 'First quiz completed', icon: '🎯' },
  { id: 'quiz_master', label: 'Scored 80% or higher', icon: '🏆' },
  { id: 'checklist_ready', label: 'Checklist complete', icon: '✅' },
];

export async function saveUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
  if (isFirebaseConfigured) {
    await updateUserProfile(uid, data);
  } else {
    await localUpdateProfile(uid, data);
  }
  const current = useAuthStore.getState().user;
  if (current?.uid === uid) {
    useAuthStore.getState().setUser({ ...current, ...data });
  }
}

export function mergeQuizProgress(
  user: AppUser,
  disasterId: string,
  scorePct: number
): Pick<AppUser, 'quizScores' | 'badgesEarned'> {
  const quizScores = { ...user.quizScores, [disasterId]: scorePct };
  const badges = new Set(user.badgesEarned);
  badges.add('first_quiz');
  if (scorePct >= 80) badges.add('quiz_master');
  badges.add(`${disasterId}_expert`);
  return { quizScores, badgesEarned: [...badges] };
}

export function mergeModuleComplete(
  user: AppUser,
  disasterId: string
): Pick<AppUser, 'completedModules' | 'badgesEarned'> {
  const completedModules = user.completedModules.includes(disasterId)
    ? user.completedModules
    : [...user.completedModules, disasterId];
  const badges = new Set(user.badgesEarned);
  badges.add('checklist_ready');
  return { completedModules, badgesEarned: [...badges] };
}
