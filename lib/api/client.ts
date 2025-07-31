const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

import { Deal, KanbanStage } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

interface GmailLabel {
  id: string;
  name: string;
  type?: string;
}

interface KanbanLabels {
  parentLabel: GmailLabel;
  stageLabels: Record<string, GmailLabel>;
}

interface GmailDeal extends Deal {
  isFromGmail: boolean;
  gmailMessageId: string;
  gmailThreadId: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Try to get token from cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }

    // Fallback to localStorage for backward compatibility
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;

    // Set token in cookie (httpOnly would be better but requires server-side setting)
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

    // Also set in localStorage for backward compatibility
    localStorage.setItem('token', token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;

    // Remove token from cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Also remove from localStorage
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.accessToken) {
      this.setToken(response.accessToken);
    }

    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.accessToken) {
      this.setToken(response.accessToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.removeToken();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Gmail OAuth endpoints
  async getGmailAuthUrl(): Promise<{ authUrl: string }> {
    return this.request<{ authUrl: string }>('/api/auth/gmail/auth-url');
  }

  async getGmailStatus(): Promise<{ connected: boolean; email?: string }> {
    return this.request<{ connected: boolean; email?: string }>('/api/auth/gmail/status');
  }

  async disconnectGmail(): Promise<void> {
    await this.request('/api/auth/gmail/disconnect', {
      method: 'DELETE',
    });
  }

  // Gmail sync endpoints
  async ensureKanbanLabels(): Promise<KanbanLabels> {
    return this.request<KanbanLabels>('/api/gmail/sync/labels', {
      method: 'POST',
    });
  }

  async syncGmailEmails(): Promise<GmailDeal[]> {
    return this.request<GmailDeal[]>('/api/gmail/sync/emails');
  }

  async getGmailEmailsByStage(stage: KanbanStage): Promise<GmailDeal[]> {
    return this.request<GmailDeal[]>(`/api/gmail/sync/stage/${stage}`);
  }

  async moveGmailEmail(messageId: string, fromStage: KanbanStage, toStage: KanbanStage): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/gmail/sync/move', {
      method: 'POST',
      body: JSON.stringify({ messageId, fromStage, toStage }),
    });
  }

  async getAllGmailLabels(): Promise<GmailLabel[]> {
    return this.request<GmailLabel[]>('/api/gmail/labels');
  }

  // Deals endpoints
  async getDeals(): Promise<Deal[]> {
    return this.request<Deal[]>('/api/deals');
  }

  async createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    return this.request<Deal>('/api/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  async updateDeal(id: string, deal: Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Deal> {
    return this.request<Deal>(`/api/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deal),
    });
  }

  async deleteDeal(id: string): Promise<void> {
    await this.request(`/api/deals/${id}`, {
      method: 'DELETE',
    });
  }

  async moveDeal(dealId: string, newStage: KanbanStage, newPosition: number): Promise<Deal> {
    return this.request<Deal>('/api/deals/move', {
      method: 'POST',
      body: JSON.stringify({ dealId, newStage, newPosition }),
    });
  }
}

export const apiClient = new ApiClient();