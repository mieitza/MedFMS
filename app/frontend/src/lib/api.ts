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

  async getDrivers(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/drivers?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }

    return response.json();
  },

  async getDriverById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch driver');
    }

    return response.json();
  },

  async createDriver(driverData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(driverData),
    });

    if (!response.ok) {
      throw new Error('Failed to create driver');
    }

    return response.json();
  },

  async updateDriver(id: number, driverData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(driverData),
    });

    if (!response.ok) {
      throw new Error('Failed to update driver');
    }

    return response.json();
  },

  async deleteDriver(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete driver');
    }

    return response.json();
  },

  // Document Management APIs
  async getDocumentCategories() {
    const response = await fetch(`${API_BASE_URL}/documents/categories`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch document categories');
    }

    return response.json();
  },

  async getDocuments(entityType, entityId) {
    const response = await fetch(`${API_BASE_URL}/documents/${entityType}/${entityId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return response.json();
  },

  async uploadDocument(file, data) {
    const formData = new FormData();
    formData.append('document', file);
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    return response.json();
  },

  async downloadDocument(id) {
    const response = await fetch(`${API_BASE_URL}/documents/download/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    return response.blob();
  },

  async deleteDocument(id) {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete document');
    }

    return response.json();
  },

  // Photo Management APIs
  async getPhotos(entityType, entityId) {
    const response = await fetch(`${API_BASE_URL}/documents/photos/${entityType}/${entityId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }

    return response.json();
  },

  async uploadPhoto(file, data) {
    const formData = new FormData();
    formData.append('photo', file);
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/documents/photos/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }

    return response.json();
  },

  getPhotoUrl(id) {
    return `${API_BASE_URL}/documents/photos/view/${id}`;
  },

  async deletePhoto(id) {
    const response = await fetch(`${API_BASE_URL}/documents/photos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }

    return response.json();
  },
};