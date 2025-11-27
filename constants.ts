import { AIModel, ModelType, Transaction, User, UserRole, GeneratedAsset } from './types';

// Mock Initial Data
export const INITIAL_MODELS: AIModel[] = [
  {
    id: 'fp-t2v-01',
    name: 'Freepik Motion V1',
    type: ModelType.TEXT_TO_VIDEO,
    description: 'Generate high-quality 5s videos from text prompts.',
    costPerGeneration: 50,
    status: 'active',
    thumbnailUrl: 'https://picsum.photos/400/225?random=1'
  },
  {
    id: 'fp-i2v-01',
    name: 'Freepik Animate Pro',
    type: ModelType.IMAGE_TO_VIDEO,
    description: 'Bring static images to life with subtle motion.',
    costPerGeneration: 80,
    status: 'active',
    thumbnailUrl: 'https://picsum.photos/400/225?random=2'
  },
  {
    id: 'fp-t2i-01',
    name: 'Freepik Flux Realism',
    type: ModelType.TEXT_TO_IMAGE,
    description: 'Hyper-realistic image generation.',
    costPerGeneration: 10,
    status: 'active',
    thumbnailUrl: 'https://picsum.photos/400/225?random=3'
  }
];

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'System Admin',
  email: 'admin@nexus.ai',
  role: UserRole.ADMIN,
  credits: 99999,
  joinedAt: '2023-01-01',
  avatarUrl: 'https://picsum.photos/100/100?random=10'
};

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Ahmed Developer',
  email: 'ahmed@client.com',
  role: UserRole.USER,
  credits: 500,
  joinedAt: '2024-02-15',
  avatarUrl: 'https://picsum.photos/100/100?random=11'
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    type: 'DEPOSIT',
    amount: 1000,
    description: 'Initial Deposit via Admin',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'completed'
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    type: 'SPEND',
    amount: 50,
    description: 'Generated Video using Motion V1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'completed'
  }
];

export const INITIAL_ASSETS: GeneratedAsset[] = [
  {
    id: 'asset-1',
    userId: 'user-1',
    modelId: 'fp-t2v-01',
    prompt: 'A futuristic city with flying cars in cyberpunk style',
    resultUrl: 'https://picsum.photos/800/450?random=100', // Placeholder for video thumb
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    cost: 50
  }
];
