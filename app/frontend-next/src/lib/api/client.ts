import type { ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private selectedCompanyId: number | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Initialize token and selectedCompanyId from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      const storedCompanyId = localStorage.getItem('selected_company_id');
      this.selectedCompanyId = storedCompanyId ? parseInt(storedCompanyId, 10) : null;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setSelectedCompany(companyId: number | null) {
    this.selectedCompanyId = companyId;
    if (typeof window !== 'undefined') {
      if (companyId) {
        localStorage.setItem('selected_company_id', String(companyId));
      } else {
        localStorage.removeItem('selected_company_id');
      }
    }
  }

  getSelectedCompany(): number | null {
    return this.selectedCompanyId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    // Add selected company header for super_admin company switching
    if (this.selectedCompanyId) {
      (headers as Record<string, string>)['X-Selected-Company'] = String(this.selectedCompanyId);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - clear token and redirect to login
    if (response.status === 401) {
      this.setToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error ${response.status}` };
      }
      throw new ApiClientError(errorData.message, response.status, errorData);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    const json = await response.json();

    // Backend wraps responses in { success: boolean, data: T, pagination?: {...} }
    // Unwrap the data if present
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      // For paginated responses, return { data, pagination }
      if ('pagination' in json) {
        return { data: json.data, pagination: json.pagination } as T;
      }
      // For single item responses, return just the data
      return json.data as T;
    }

    return json;
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {};
    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }
    if (this.selectedCompanyId) {
      (headers as Record<string, string>)['X-Selected-Company'] = String(this.selectedCompanyId);
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Upload failed with status ${response.status}` };
      }
      throw new ApiClientError(errorData.message, response.status, errorData);
    }

    const json = await response.json();

    // Backend wraps responses in { success: boolean, data: T }
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T;
    }

    return json;
  }
}

// Custom error class for API errors
export class ApiClientError extends Error {
  status: number;
  details?: ApiError;

  constructor(message: string, status: number, details?: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

// Singleton instance
export const api = new ApiClient(API_BASE_URL);

// Re-export for convenience
export default api;
