export type BusinessRole = 'owner' | 'admin' | 'employee' | 'chatbot';

export interface BusinessMember {
  userId: string;
  role: BusinessRole;
  joinedAt: Date;
}

export interface BusinessSettings {
  timezone: string;
  currency: string;
  language: string;
}

export class Business {
  id: string;
  name: string;
  description?: string;
  settings: BusinessSettings;
  members: BusinessMember[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Business>) {
    Object.assign(this, data);
  }

  /**
   * Get member by user ID
   */
  getMember(userId: string): BusinessMember | undefined {
    return this.members.find((m) => m.userId === userId);
  }

  /**
   * Check if user has access to this business
   */
  hasAccess(userId: string): boolean {
    return this.members.some((m) => m.userId === userId);
  }

  /**
   * Get user's role in this business
   */
  getUserRole(userId: string): BusinessRole | null {
    const member = this.getMember(userId);
    return member ? member.role : null;
  }
}

