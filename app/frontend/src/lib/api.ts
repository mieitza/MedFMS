const API_BASE_URL = 'http://localhost:3000/api';

interface LoginRequest {
  username: string;
  pin: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
      fullName: string;
      role: string;
    };
  };
}

export const api = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');

    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Vehicles API
  async getVehicles(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/vehicles?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }

    return response.json();
  },

  async getVehicleById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle');
    }

    return response.json();
  },

  async createVehicle(vehicleData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
      throw new Error('Failed to create vehicle');
    }

    return response.json();
  },

  async updateVehicle(id: number, vehicleData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
      throw new Error('Failed to update vehicle');
    }

    return response.json();
  },

  async deleteVehicle(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete vehicle');
    }

    return response.json();
  },

  // System APIs for dropdowns
  async getBrands(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/system/brands`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }

    return response.json();
  },

  async getModels(brandId?: number): Promise<any> {
    const queryParams = new URLSearchParams();
    if (brandId) queryParams.append('brandId', brandId.toString());

    const response = await fetch(`${API_BASE_URL}/system/models?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    return response.json();
  },

  async getVehicleTypes(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/system/vehicle-types`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle types');
    }

    return response.json();
  },

  async getVehicleStatuses(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/system/vehicle-statuses`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle statuses');
    }

    return response.json();
  },

  async getFuelTypes(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/fuel/types`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel types');
    }

    return response.json();
  },

  async getLocations(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/system/locations`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    return response.json();
  },

  async getDepartments(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/system/departments`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }

    return response.json();
  },

  async getDrivers(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }

    return response.json();
  },
};