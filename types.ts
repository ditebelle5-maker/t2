export type ViewType = 'agentes' | 'conteudo' | 'comunidade' | 'admin';

export type AgentType = 'generator' | 'promptSpecialist' | 'imageReplicator' | 'watermarkRemover';

export type Theme = 'light' | 'dark' | 'system';

export interface Video {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  online?: boolean;
  warned?: boolean;
  canPost?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface HistoryItem {
  id: number;
  agentType: AgentType;
  timestamp: string;
  prompt: string;
  inputImage?: string; // base64
  output: string; // text response or base64 image or video URL
}

export interface ChatHistory {
  id: number;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

export interface SelectedCourseData {
  video: Video;
  playlist: Video[];
  courseTitle: string;
}