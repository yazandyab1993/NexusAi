import { AIModel, GeneratedAsset, Transaction, User, UserRole } from '../types';
import { INITIAL_ASSETS, INITIAL_MODELS, INITIAL_TRANSACTIONS, MOCK_ADMIN, MOCK_USER } from '../constants';

// This class simulates a Backend API and Database
class MockApiService {
  private users: User[] = [MOCK_ADMIN, MOCK_USER];
  private models: AIModel[] = INITIAL_MODELS;
  private transactions: Transaction[] = INITIAL_TRANSACTIONS;
  private assets: GeneratedAsset[] = INITIAL_ASSETS;

  // Simulate Login
  async login(email: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Network delay
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Get User Data
  async getUser(userId: string): Promise<User | undefined> {
    return this.users.find(u => u.id === userId);
  }

  // Get All Users (Admin only)
  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  // Add Credits (Admin Action)
  async addCredits(adminId: string, targetUserId: string, amount: number): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = this.users.find(u => u.id === targetUserId);
    if (!user) throw new Error('User not found');
    
    user.credits += amount;
    
    // Log transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: targetUserId,
      type: 'DEPOSIT',
      amount: amount,
      description: 'Credits added by Admin',
      date: new Date().toISOString(),
      status: 'completed'
    };
    this.transactions.unshift(newTx);
    
    return { ...user };
  }

  // Generate Content (Deduct Credits)
  async generateContent(userId: string, modelId: string, prompt: string): Promise<GeneratedAsset> {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time
    
    const user = this.users.find(u => u.id === userId);
    const model = this.models.find(m => m.id === modelId);
    
    if (!user || !model) throw new Error('Invalid request');
    if (user.credits < model.costPerGeneration) throw new Error('Insufficient credits');

    // Deduct
    user.credits -= model.costPerGeneration;

    // Log Spend Transaction
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      userId: userId,
      type: 'SPEND',
      amount: model.costPerGeneration,
      description: `Generated content: ${model.name}`,
      date: new Date().toISOString(),
      status: 'completed'
    });

    // Create Asset
    const newAsset: GeneratedAsset = {
      id: `gen-${Date.now()}`,
      userId,
      modelId,
      prompt,
      resultUrl: `https://picsum.photos/800/450?random=${Date.now()}`, // In real app, this is the video URL from Freepik
      createdAt: new Date().toISOString(),
      cost: model.costPerGeneration
    };
    this.assets.unshift(newAsset);

    return newAsset;
  }

  getModels() { return this.models; }
  
  getUserTransactions(userId: string) {
    return this.transactions.filter(t => t.userId === userId);
  }

  getUserAssets(userId: string) {
    return this.assets.filter(a => a.userId === userId);
  }
}

export const api = new MockApiService();
