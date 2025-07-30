const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
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

    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
    }

    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
    }

    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  }

  // Gmail integration
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

  // Deals endpoints
  async getDeals(): Promise<any[]> {
    return this.request<any[]>('/api/deals');
  }

  async createDeal(deal: any): Promise<any> {
    return this.request('/api/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  async updateDeal(id: string, deal: any): Promise<any> {
    return this.request(`/api/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deal),
    });
  }

  async deleteDeal(id: string): Promise<void> {
    await this.request(`/api/deals/${id}`, {
      method: 'DELETE',
    });
  }

  async moveDeal(dealId: string, newStage: string, newPosition: number): Promise<any> {
    return this.request('/api/deals/move', {
      method: 'POST',
      body: JSON.stringify({ dealId, newStage, newPosition }),
    });
  }
}

export const apiClient = new ApiClient();