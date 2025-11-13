// Use relative URL in production, localhost in development
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api'  // Production: use relative URL (nginx will proxy)
  : 'http://localhost:3000/api';  // Development: direct to backend

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

// Helper function to handle 401 errors globally
function handle401Error() {
  if (typeof window !== 'undefined') {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    window.location.href = '/login';
  }
}

// Enhanced fetch wrapper that handles 401 errors automatically
async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, options);

  // If we get a 401, clear auth and redirect to login
  if (response.status === 401) {
    handle401Error();
    throw new Error('Authentication required. Redirecting to login...');
  }

  return response;
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

  // Dashboard API
  async getDashboardStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard statistics');
    }

    return response.json();
  },

  getAuthHeaders(includeContentType = true): Record<string, string> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  },

  // Generic GET helper
  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    return response.json();
  },

  // Generic POST helper
  async post(endpoint: string, data?: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to post to ${endpoint}`);
    }

    return response.json();
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
      headers: this.getAuthHeaders(),
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
      headers: this.getAuthHeaders(),
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
      headers: this.getAuthHeaders(),
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
      headers: this.getAuthHeaders(),
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
      headers: this.getAuthHeaders(false),
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
      headers: this.getAuthHeaders(false),
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

  async downloadPhoto(id) {
    const response = await fetch(`${API_BASE_URL}/documents/photos/download/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to download photo');
    }

    return response.blob();
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

  // Fuel Management APIs
  async getFuelTypes() {
    const response = await fetch(`${API_BASE_URL}/fuel/types`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel types');
    }

    return response.json();
  },

  async createFuelType(fuelTypeData) {
    const response = await fetch(`${API_BASE_URL}/fuel/types`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(fuelTypeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create fuel type');
    }

    return response.json();
  },

  async getFuelStations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.active !== undefined) queryParams.append('active', params.active);

    const response = await fetch(`${API_BASE_URL}/fuel/stations?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel stations');
    }

    return response.json();
  },

  async createFuelStation(stationData) {
    const response = await fetch(`${API_BASE_URL}/fuel/stations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(stationData),
    });

    if (!response.ok) {
      throw new Error('Failed to create fuel station');
    }

    return response.json();
  },

  async getFuelStationById(id) {
    const response = await fetch(`${API_BASE_URL}/fuel/stations/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel station');
    }

    return response.json();
  },

  async updateFuelStation(id, stationData) {
    const response = await fetch(`${API_BASE_URL}/fuel/stations/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(stationData),
    });

    if (!response.ok) {
      throw new Error('Failed to update fuel station');
    }

    return response.json();
  },

  async getFuelTransactions(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString());
    if (params.driverId) queryParams.append('driverId', params.driverId.toString());
    if (params.stationId) queryParams.append('stationId', params.stationId.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.transactionType) queryParams.append('transactionType', params.transactionType);
    if (params.approved !== undefined) queryParams.append('approved', params.approved.toString());

    const response = await fetch(`${API_BASE_URL}/fuel/transactions?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel transactions');
    }

    return response.json();
  },

  async createFuelTransaction(transactionData) {
    const response = await fetch(`${API_BASE_URL}/fuel/transactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create fuel transaction');
    }

    return response.json();
  },

  async getFuelTransactionById(id) {
    const response = await fetch(`${API_BASE_URL}/fuel/transactions/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel transaction');
    }

    return response.json();
  },

  async updateFuelTransaction(id, transactionData) {
    const response = await fetch(`${API_BASE_URL}/fuel/transactions/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error('Failed to update fuel transaction');
    }

    return response.json();
  },

  async approveFuelTransaction(id) {
    const response = await fetch(`${API_BASE_URL}/fuel/transactions/${id}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to approve fuel transaction');
    }

    return response.json();
  },

  async rejectFuelTransaction(id) {
    const response = await fetch(`${API_BASE_URL}/fuel/transactions/${id}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to reject fuel transaction');
    }

    return response.json();
  },

  async getFuelEfficiencyReport(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/fuel/reports/efficiency?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to generate fuel efficiency report');
    }

    return response.json();
  },

  async getVehicleFuelTanks(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString());

    const response = await fetch(`${API_BASE_URL}/fuel/tanks?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fuel tanks');
    }

    return response.json();
  },

  async createVehicleFuelTank(tankData) {
    const response = await fetch(`${API_BASE_URL}/fuel/tanks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(tankData),
    });

    if (!response.ok) {
      throw new Error('Failed to create fuel tank');
    }

    return response.json();
  },

  async updateVehicleFuelTank(id, tankData) {
    const response = await fetch(`${API_BASE_URL}/fuel/tanks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(tankData),
    });

    if (!response.ok) {
      throw new Error('Failed to update fuel tank');
    }

    return response.json();
  },

  // Maintenance Management APIs
  async getMaintenanceTypes(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.active !== undefined) queryParams.append('active', params.active);

    const response = await fetch(`${API_BASE_URL}/maintenance/types?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance types');
    }

    return response.json();
  },

  async createMaintenanceType(typeData) {
    const response = await fetch(`${API_BASE_URL}/maintenance/types`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(typeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create maintenance type');
    }

    return response.json();
  },

  async getMaintenanceWorkOrders(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority.toString());
    if (params.assignedTechnicianId) queryParams.append('assignedTechnicianId', params.assignedTechnicianId.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch work orders');
    }

    return response.json();
  },

  async createMaintenanceWorkOrder(workOrderData) {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(workOrderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create work order');
    }

    return response.json();
  },

  async getMaintenanceWorkOrderById(id) {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch work order');
    }

    return response.json();
  },

  async updateMaintenanceWorkOrder(id, workOrderData) {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(workOrderData),
    });

    if (!response.ok) {
      throw new Error('Failed to update work order');
    }

    return response.json();
  },

  async updateMaintenanceWorkOrderStatus(id, status, notes) {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to update work order status');
    }

    return response.json();
  },

  async getMaintenanceAlerts(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString());
    if (params.alertType) queryParams.append('alertType', params.alertType);
    if (params.resolved !== undefined) queryParams.append('resolved', params.resolved.toString());

    const response = await fetch(`${API_BASE_URL}/maintenance/alerts?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance alerts');
    }

    return response.json();
  },

  async getMaintenanceSchedules(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString());

    const response = await fetch(`${API_BASE_URL}/maintenance/schedules?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance schedules');
    }

    return response.json();
  },

  async getMaintenanceHistory(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId.toString());
    if (params.maintenanceTypeId) queryParams.append('maintenanceTypeId', params.maintenanceTypeId.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/maintenance/history?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance history');
    }

    return response.json();
  },

  async getMaintenanceDashboard() {
    const response = await fetch(`${API_BASE_URL}/maintenance/dashboard`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance dashboard data');
    }

    return response.json();
  },

  // Approval workflow APIs
  async getWorkOrdersForApproval(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority.toString());

    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/pending-approval?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch work orders for approval');
    }

    return response.json();
  },

  async approveWorkOrder(workOrderId, notes = '') {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/${workOrderId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve work order');
    }

    return response.json();
  },

  async rejectWorkOrder(workOrderId, notes) {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/${workOrderId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject work order');
    }

    return response.json();
  },

  async updateWorkOrder(workOrderId, data) {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/${workOrderId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update work order');
    }

    return response.json();
  },

  async deleteWorkOrder(workOrderId) {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders/${workOrderId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete work order');
    }

    return response.json();
  },

  // Materials Management APIs
  async getMaterials(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/materials?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }

    return response.json();
  },

  async getMaterialById(id) {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch material');
    }

    return response.json();
  },

  async createMaterial(materialData) {
    const response = await fetch(`${API_BASE_URL}/materials`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(materialData),
    });

    if (!response.ok) {
      throw new Error('Failed to create material');
    }

    return response.json();
  },

  async updateMaterial(id, materialData) {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(materialData),
    });

    if (!response.ok) {
      throw new Error('Failed to update material');
    }

    return response.json();
  },

  async deleteMaterial(id) {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete material');
    }

    return response.json();
  },

  async getMaterialTransactions(materialId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/materials/${materialId}/transactions?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch material transactions');
    }

    return response.json();
  },

  async createMaterialTransaction(transactionData) {
    const response = await fetch(`${API_BASE_URL}/materials/transactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create material transaction');
    }

    return response.json();
  },

  async getLowStockMaterials() {
    const response = await fetch(`${API_BASE_URL}/materials/low-stock`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch low stock materials');
    }

    return response.json();
  },

  async getWarehouses() {
    const response = await fetch(`${API_BASE_URL}/materials/warehouses`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error(`Failed to fetch warehouses: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async getWarehouse(id) {
    const response = await fetch(`${API_BASE_URL}/materials/warehouses/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error(`Failed to fetch warehouse: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async createWarehouse(warehouseData) {
    const response = await fetch(`${API_BASE_URL}/materials/warehouses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(warehouseData),
    });

    if (!response.ok) {
      throw new Error('Failed to create warehouse');
    }

    return response.json();
  },

  async updateWarehouse(id, warehouseData) {
    const response = await fetch(`${API_BASE_URL}/materials/warehouses/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(warehouseData),
    });

    if (!response.ok) {
      throw new Error('Failed to update warehouse');
    }

    return response.json();
  },

  // Material Units APIs
  async getMaterialUnits(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.active !== undefined) queryParams.append('active', params.active.toString());

    const response = await fetch(`${API_BASE_URL}/materials/units?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch material units');
    }

    return response.json();
  },

  async createMaterialUnit(unitData) {
    const response = await fetch(`${API_BASE_URL}/materials/units`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(unitData),
    });

    if (!response.ok) {
      throw new Error('Failed to create material unit');
    }

    return response.json();
  },

  async updateMaterialUnit(id, unitData) {
    const response = await fetch(`${API_BASE_URL}/materials/units/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(unitData),
    });

    if (!response.ok) {
      throw new Error('Failed to update material unit');
    }

    return response.json();
  },

  // Warehouse Transfer Request APIs
  async getTransferRequests(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority.toString());
    if (params.sourceWarehouseId) queryParams.append('sourceWarehouseId', params.sourceWarehouseId.toString());
    if (params.destinationWarehouseId) queryParams.append('destinationWarehouseId', params.destinationWarehouseId.toString());
    if (params.materialId) queryParams.append('materialId', params.materialId.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transfer requests');
    }

    return response.json();
  },

  async getTransferRequestsForApproval(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/pending-approval?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transfer requests for approval');
    }

    return response.json();
  },

  async getTransferRequestById(id) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transfer request');
    }

    return response.json();
  },

  async createTransferRequest(requestData) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Failed to create transfer request');
    }

    return response.json();
  },

  async updateTransferRequest(id, requestData) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Failed to update transfer request');
    }

    return response.json();
  },

  async updateTransferRequestStatus(id, status, notes) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to update transfer request status');
    }

    return response.json();
  },

  async approveTransferRequest(id, notes = '', approvedQuantity = null) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/${id}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notes, approvedQuantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve transfer request');
    }

    return response.json();
  },

  async rejectTransferRequest(id, rejectionReason) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/${id}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ rejectionReason }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject transfer request');
    }

    return response.json();
  },

  async completeTransferRequest(id, qualityCheckNotes = null, transferredQuantity = null, additionalData = {}) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/${id}/complete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ qualityCheckNotes, transferredQuantity, ...additionalData }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete transfer request');
    }

    return response.json();
  },

  async deleteTransferRequest(id) {
    const response = await fetch(`${API_BASE_URL}/materials/transfer-requests/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete transfer request');
    }

    return response.json();
  },

  // Reports API
  async getFleetOverviewReport(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/reports/fleet-overview?${queryParams}`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fleet overview report');
    }

    return response.json();
  },

  async getMaintenanceAnalyticsReport(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/reports/maintenance-analytics?${queryParams}`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance analytics report');
    }

    return response.json();
  },

  async getCostAnalysisReport(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/reports/cost-analysis?${queryParams}`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cost analysis report');
    }

    return response.json();
  },

  async getPerformanceMetricsReport(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/reports/performance-metrics?${queryParams}`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch performance metrics report');
    }

    return response.json();
  },

  async getExecutiveSummaryReport(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/reports/executive-summary?${queryParams}`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch executive summary report');
    }

    return response.json();
  },

  // Admin Settings API
  async getReferenceDataTypes() {
    const response = await fetch(`${API_BASE_URL}/admin/reference-data-types`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reference data types');
    }

    return response.json();
  },

  async getReferenceData(dataType) {
    const response = await fetch(`${API_BASE_URL}/admin/${dataType}`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataType}`);
    }

    return response.json();
  },

  async getReferenceDataItem(dataType, id) {
    const response = await fetch(`${API_BASE_URL}/admin/${dataType}/${id}`, {
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataType} item`);
    }

    return response.json();
  },

  async createReferenceData(dataType, data) {
    const response = await fetch(`${API_BASE_URL}/admin/${dataType}`, {
      method: 'POST',
      headers: {
        ...api.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create ${dataType}`);
    }

    return response.json();
  },

  async updateReferenceData(dataType, id, data) {
    const response = await fetch(`${API_BASE_URL}/admin/${dataType}/${id}`, {
      method: 'PUT',
      headers: {
        ...api.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update ${dataType}`);
    }

    return response.json();
  },

  async deleteReferenceData(dataType, id) {
    const response = await fetch(`${API_BASE_URL}/admin/${dataType}/${id}`, {
      method: 'DELETE',
      headers: api.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete ${dataType}`);
    }

    return response.json();
  },

  // User Management
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.active !== undefined) queryParams.append('active', params.active.toString());

    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async getUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return response.json();
  },

  async createUser(userData) {
    const response = await apiFetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || error.message || 'Failed to create user');
    }

    return response.json();
  },

  async updateUser(id, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return response.json();
  },

  async updateCurrentUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },

  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }

    return response.json();
  },

  async activateUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/activate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to activate user');
    }

    return response.json();
  },

  async deactivateUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/deactivate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to deactivate user');
    }

    return response.json();
  },

  async resetUserPin(id, newPin) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/reset-pin`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ newPin }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset PIN');
    }

    return response.json();
  },

  async changePin(currentPin, newPin) {
    const response = await fetch(`${API_BASE_URL}/users/me/change-pin`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPin, newPin }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change PIN');
    }

    return response.json();
  },

  // ===== VEHICLE INVENTORY API =====

  // Categories
  async getVehicleInventoryCategories() {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/categories`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle inventory categories');
    }

    return response.json();
  },

  async createVehicleInventoryCategory(categoryData) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/categories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create vehicle inventory category');
    }

    return response.json();
  },

  // Items
  async getVehicleInventoryItems(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());

    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/items?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle inventory items');
    }

    return response.json();
  },

  async getVehicleInventoryItemById(id) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/items/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle inventory item');
    }

    return response.json();
  },

  async createVehicleInventoryItem(itemData) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to create vehicle inventory item');
    }

    return response.json();
  },

  async updateVehicleInventoryItem(id, itemData) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/items/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to update vehicle inventory item');
    }

    return response.json();
  },

  async deleteVehicleInventoryItem(id) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/items/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete vehicle inventory item');
    }

    return response.json();
  },

  // Assignments
  async getVehicleInventoryAssignments(vehicleId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/vehicles/${vehicleId}/assignments?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle inventory assignments');
    }

    return response.json();
  },

  // Get materials currently in vehicle from unified transfer system
  async getVehicleMaterials(vehicleId) {
    const response = await fetch(`${API_BASE_URL}/materials/vehicles/${vehicleId}/materials`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle materials');
    }

    return response.json();
  },

  // Get materials currently assigned to employee from unified transfer system
  async getEmployeeMaterials(employeeId) {
    const response = await fetch(`${API_BASE_URL}/materials/employees/${employeeId}/materials`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee materials');
    }

    return response.json();
  },

  async getVehicleInventoryAssignmentById(id) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/assignments/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle inventory assignment');
    }

    return response.json();
  },

  async createVehicleInventoryAssignment(assignmentData) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/assignments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create vehicle inventory assignment');
    }

    return response.json();
  },

  async updateVehicleInventoryAssignment(id, assignmentData) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/assignments/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to update vehicle inventory assignment');
    }

    return response.json();
  },

  async removeVehicleInventoryAssignment(id) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/assignments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove vehicle inventory assignment');
    }

    return response.json();
  },

  // Inspections
  async getVehicleInventoryInspections(assignmentId) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/assignments/${assignmentId}/inspections`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle inventory inspections');
    }

    return response.json();
  },

  async createVehicleInventoryInspection(inspectionData) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/inspections`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(inspectionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create vehicle inventory inspection');
    }

    return response.json();
  },

  // Dispensing
  async getVehicleDispensingHistory(vehicleId) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/vehicles/${vehicleId}/dispensing`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle dispensing history');
    }

    return response.json();
  },

  async getAssignmentDispensingHistory(assignmentId) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/assignments/${assignmentId}/dispensing`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignment dispensing history');
    }

    return response.json();
  },

  async dispenseInventoryItem(dispensingData) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/dispensing`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(dispensingData),
    });

    if (!response.ok) {
      throw new Error('Failed to dispense inventory item');
    }

    return response.json();
  },

  async getDispensingRecordById(id) {
    const response = await fetch(`${API_BASE_URL}/vehicle-inventory/dispensing/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dispensing record');
    }

    return response.json();
  },
};

export default api;