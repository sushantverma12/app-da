export type UserRole = 'admin' | 'student';
export type RiskLevel = 'high' | 'medium' | 'low';
export type DrillStatus = 'active' | 'completed';
export type AlertType = 'Evacuate' | 'Shelter' | 'Lockdown' | 'All Clear';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  schoolCode: string;
  schoolName: string;
  city: string;
  district: string;
  state: string;
  fcmToken?: string;
  /** Expo push token from EAS build — used by Cloud Functions for remote push */
  expoPushToken?: string;
  badgesEarned: string[];
  quizScores: Record<string, number>;
  completedModules: string[];
}

export interface Disaster {
  id: string;
  type: string;
  title: string;
  description: string;
  riskByRegion: Record<string, RiskLevel>;
  icon: string;
  contentSections: {
    whatIsIt: string;
    howToPrepare: string[];
    duringSteps: string[];
    afterSteps: string[];
  };
  videoUrl: string;
  checklistItems: string[];
  quizId: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  disasterId: string;
  questions: QuizQuestion[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'hospital' | 'fire_station' | 'shelter' | 'police';
  lat: number;
  lng: number;
  district: string;
  state: string;
  phone: string;
}

export interface Drill {
  id: string;
  schoolCode: string;
  disasterType: string;
  status: DrillStatus;
  startedBy: string;
  startedAt: Date;
  durationMinutes: number;
  expectedCount: number;
  checkedInCount: number;
  checkedInUIDs: string[];
  anonymousCount: number;
  firstScanAt?: Date;
  lastScanAt?: Date;
  completedAt?: Date;
}

export interface School {
  schoolCode: string;
  schoolName: string;
  city: string;
  district: string;
  state: string;
  adminUid: string;
  adminEmail: string;
  qrData: string;
}

export interface LocationInfo {
  city: string;
  district: string;
  state: string;
  lat?: number;
  lng?: number;
}

export interface ChannelMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: Date;
  expiresAt?: Date;
}

export interface EmergencyAlert {
  id: string;
  schoolCode: string;
  type: AlertType;
  message: string;
  sentBy: string;
  sentAt: Date;
}
