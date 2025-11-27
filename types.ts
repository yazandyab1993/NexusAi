export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  avatarUrl?: string;
  joinedAt: string;
}

export enum ModelType {
  TEXT_TO_VIDEO = 'Text to Video',
  IMAGE_TO_VIDEO = 'Image to Video',
  TEXT_TO_IMAGE = 'Text to Image',
}

export interface AIModel {
  id: string;
  name: string;
  type: ModelType;
  description: string;
  costPerGeneration: number;
  status: 'active' | 'maintenance';
  thumbnailUrl: string;
  apiEndpoint?: string; // Placeholder for Freepik endpoint
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'SPEND';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'failed' | 'pending';
}

export interface GeneratedAsset {
  id: string;
  userId: string;
  modelId: string;
  prompt: string;
  resultUrl: string; // URL of generated video/image
  createdAt: string;
  cost: number;
}
