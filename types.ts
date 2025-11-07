export type ViewType = 'agentes' | 'conteudo' | 'comunidade' | 'admin';

export type AgentType = 'generator' | 'videoGenerator' | 'promptSpecialist' | 'imageReplicator';

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

export interface Comment {
    id: number;
    author: string;
    avatar: string;
    content: string;
    time: string;
}

export interface Post {
    id: number;
    title: string;
    author: string;
    content: string;
    imageUrls?: string[];
    time: string;
    avatar: string;
    likes: number;
    liked: boolean;
    pinned?: boolean;
    comments?: Comment[];
}

export interface SelectedCourseData {
  video: Video;
  playlist: Video[];
  courseTitle: string;
}