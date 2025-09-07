export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  bio?: string;
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    interestedIn: string[];
    lookingFor: 'dating' | 'friends' | 'both';
  };
  interests: string[];
  spotify?: {
    id: string;
    topArtists: string[];
    topGenres: string[];
    topTracks: string[];
    playlists: SpotifyPlaylist[];
  };
  instagram?: {
    username: string;
    photos: string[];
    followers: number;
  };
  isVerified: boolean;
  lastActive: string;
  createdAt: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: number;
  image?: string;
}

export interface Match {
  id: string;
  users: [string, string];
  compatibility: {
    overall: number;
    music: number;
    interests: number;
    location: number;
  };
  status: 'pending' | 'matched' | 'declined';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'party' | 'casual' | 'sports' | 'cultural' | 'food' | 'nightlife' | 'other';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    venue?: string;
  };
  date: string;
  time: string;
  maxAttendees?: number;
  currentAttendees: string[];
  interestedUsers: string[];
  createdBy: string;
  photos: string[];
  tags: string[];
  ageRange?: [number, number];
  isPrivate: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'event_invite';
  timestamp: string;
  isRead: boolean;
  canReply?: boolean; // For slow chat mode
  nextReplyTime?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  isSlowChat: boolean;
  slowChatDelay: number; // in minutes
  unreadCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'event_invite' | 'event_reminder' | 'like';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}