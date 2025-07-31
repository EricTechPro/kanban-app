import { Deal, KanbanStage, GmailThread, BaseDeal, GmailDealProperties } from '../types';
import { API_CONFIG } from '../constants';
import { handleApiError, ApiError } from './errors';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const isExternalAPI = typeof window !== 'undefined' && API_URL && !API_URL.includes(window.location.origin);
const BASE_URL = isExternalAPI ? API_URL : '';

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
  summary?: {
    totalLabels: number;
    created: string[];
    existing: string[];
    failed: { label: string; error: string }[];
  };
  message?: string;
}

// Use the proper type composition for GmailDeal
type GmailDeal = BaseDeal & GmailDealProperties;

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private abortControllers: Map<string, AbortController>;

  constructor() {
    // Use relative URLs when no external API is configured
    this.baseUrl = BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.abortControllers = new Map();
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Try to get token from cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }

    // Try to get token from localStorage
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requestId?: string
  ): Promise<T> {
    // Cancel any existing request with the same ID
    if (requestId) {
      this.cancelRequest(requestId);
    }

    const controller = new AbortController();
    if (requestId) {
      this.abortControllers.set(requestId, controller);
    }

    const token = this.getToken();
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code,
          errorData.details
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return handleApiError(error);
    } finally {
      if (requestId) {
        this.abortControllers.delete(requestId);
      }
    }
  }

  private cancelRequest(requestId: string): void {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/refresh', {
      method: 'POST',
    });
  }

  // Deal endpoints
  async getDeals(): Promise<Deal[]> {
    return this.request<Deal[]>('/api/deals');
  }

  async getDeal(id: string): Promise<Deal> {
    return this.request<Deal>(`/api/deals/${id}`);
  }

  async createDeal(deal: Partial<Deal>): Promise<Deal> {
    return this.request<Deal>('/api/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    return this.request<Deal>(`/api/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteDeal(id: string): Promise<void> {
    return this.request<void>(`/api/deals/${id}`, {
      method: 'DELETE',
    });
  }

  async moveDeal(id: string, stage: KanbanStage): Promise<Deal> {
    return this.request<Deal>(`/api/deals/${id}/move`, {
      method: 'POST',
      body: JSON.stringify({ stage }),
    });
  }

  // Gmail endpoints
  async ensureKanbanLabels(): Promise<KanbanLabels> {
    return this.request<KanbanLabels>('/api/gmail/labels/ensure', {
      method: 'POST',
    });
  }

  async syncGmailEmails(): Promise<GmailDeal[]> {
    return this.request<GmailDeal[]>('/api/gmail/sync', {
      method: 'POST',
    });
  }

  async moveGmailEmail(
    messageId: string,
    fromStage: KanbanStage,
    toStage: KanbanStage
  ): Promise<void> {
    return this.request<void>(`/api/gmail/messages/${messageId}/move`, {
      method: 'POST',
      body: JSON.stringify({ fromStage, toStage }),
    });
  }

  async getGmailThreads(): Promise<GmailThread[]> {
    return this.request<GmailThread[]>('/api/gmail/threads');
  }

  async moveGmailThread(
    threadId: string,
    fromStage: KanbanStage,
    toStage: KanbanStage
  ): Promise<void> {
    return this.request<void>(`/api/gmail/threads/${threadId}/move`, {
      method: 'POST',
      body: JSON.stringify({ fromStage, toStage }),
    });
  }

  async getGmailThreadsByLabels(): Promise<GmailThread[]> {
    return this.request<GmailThread[]>('/api/gmail/threads/by-labels');
  }

  async getGmailStatus(): Promise<{ isAuthenticated: boolean; email?: string }> {
    return this.request('/api/gmail/status');
  }

  async getGmailAuthUrl(): Promise<{ url: string }> {
    return this.request('/api/gmail/auth/url');
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<{
    totalDeals: number;
    activeDeals: number;
    completedDeals: number;
    totalRevenue: number;
    monthlyRevenue: number;
  }> {
    return this.request('/api/dashboard/stats');
  }

  async getUpcomingDeadlines(): Promise<Deal[]> {
    return this.request<Deal[]>('/api/dashboard/deadlines');
  }

  // Export endpoints
  async exportDeals(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/export/deals?format=${format}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export deals');
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();