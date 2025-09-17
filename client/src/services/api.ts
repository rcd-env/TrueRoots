import axios from "axios";
import type {
  Batch,
  Collector,
  Herb,
  LabResult,
  ApiResponse,
  PaginatedResponse,
  CollectionFormData,
  LabTestFormData,
} from "../types";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://trueroots.onrender.com/api";
const IPFS_GATEWAY =
  import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Batch API
export const batchAPI = {
  // Get all batches with pagination and filters
  getBatches: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Batch>> => {
    const response = await api.get("/batches", { params });
    return response.data;
  },

  // Get single batch by ID
  getBatch: async (id: string): Promise<ApiResponse<Batch>> => {
    const response = await api.get(`/batches/${id}`);
    return response.data;
  },

  // Create new batch (collector submission)
  createBatch: async (
    data: CollectionFormData
  ): Promise<ApiResponse<Batch>> => {
    const formData = new FormData();
    formData.append("herbId", data.herbId);
    formData.append("quantity", data.quantity.toString());
    formData.append("unit", data.unit);
    formData.append("notes", data.notes || "");

    // Add images
    data.images.forEach((image) => {
      formData.append(`images`, image);
    });

    // Add GPS location if available
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      formData.append("latitude", position.coords.latitude.toString());
      formData.append("longitude", position.coords.longitude.toString());
    }

    const response = await api.post("/batches", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update batch status (enterprise approval/rejection)
  updateBatchStatus: async (
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<Batch>> => {
    const response = await api.patch(`/batches/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  // Get batch timeline
  getBatchTimeline: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/batches/${id}/timeline`);
    return response.data;
  },
};

// Collector API
export const collectorAPI = {
  // Get collector profile
  getProfile: async (id: string): Promise<ApiResponse<Collector>> => {
    const response = await api.get(`/collectors/${id}`);
    return response.data;
  },

  // Update collector profile
  updateProfile: async (
    id: string,
    data: Partial<Collector>
  ): Promise<ApiResponse<Collector>> => {
    const response = await api.patch(`/collectors/${id}`, data);
    return response.data;
  },

  // Get collector's batches
  getBatches: async (
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Batch>> => {
    const response = await api.get(`/collectors/${id}/batches`, { params });
    return response.data;
  },
};

// Herb API
export const herbAPI = {
  // Get all herbs
  getHerbs: async (): Promise<ApiResponse<Herb[]>> => {
    const response = await api.get("/herbs");
    return response.data;
  },

  // Get single herb
  getHerb: async (id: string): Promise<ApiResponse<Herb>> => {
    const response = await api.get(`/herbs/${id}`);
    return response.data;
  },
};

// Lab API
export const labAPI = {
  // Upload lab test results
  uploadTestResults: async (
    data: LabTestFormData
  ): Promise<ApiResponse<LabResult>> => {
    const formData = new FormData();
    formData.append("batchId", data.batchId);
    formData.append("testType", data.testType);
    formData.append("testFile", data.testFile);
    formData.append("notes", data.notes || "");

    const response = await api.post("/lab/test-results", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Get lab results for a batch
  getBatchResults: async (
    batchId: string
  ): Promise<ApiResponse<LabResult[]>> => {
    const response = await api.get(`/lab/batches/${batchId}/results`);
    return response.data;
  },

  // Get all lab results with pagination
  getResults: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<LabResult>> => {
    const response = await api.get("/lab/results", { params });
    return response.data;
  },
};

// IPFS API
export const ipfsAPI = {
  // Upload file to IPFS
  uploadFile: async (
    file: File
  ): Promise<ApiResponse<{ hash: string; url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/ipfs/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload JSON data to IPFS
  uploadJSON: async (
    data: any
  ): Promise<ApiResponse<{ hash: string; url: string }>> => {
    const response = await api.post("/ipfs/upload-json", { data });
    return response.data;
  },

  // Get file from IPFS
  getFile: (hash: string): string => {
    return `${IPFS_GATEWAY}${hash}`;
  },
};

// Blockchain API
export const blockchainAPI = {
  // Get transaction details
  getTransaction: async (txHash: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/blockchain/transaction/${txHash}`);
    return response.data;
  },

  // Verify batch on blockchain
  verifyBatch: async (
    batchId: string
  ): Promise<ApiResponse<{ verified: boolean; txHash: string }>> => {
    const response = await api.get(`/blockchain/verify/${batchId}`);
    return response.data;
  },
};

// QR Code API
export const qrAPI = {
  // Generate QR code for batch
  generateQR: async (
    batchId: string
  ): Promise<ApiResponse<{ qrCode: string; url: string }>> => {
    const response = await api.post("/qr/generate", { batchId });
    return response.data;
  },

  // Validate QR code
  validateQR: async (
    qrCode: string
  ): Promise<ApiResponse<{ valid: boolean; batchId?: string }>> => {
    const response = await api.post("/qr/validate", { qrCode });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get("/analytics/dashboard");
    return response.data;
  },

  // Get batch analytics
  getBatchAnalytics: async (timeframe?: string): Promise<ApiResponse<any>> => {
    const response = await api.get("/analytics/batches", {
      params: { timeframe },
    });
    return response.data;
  },
};

// Utility functions
export const utils = {
  // Format API error for display
  formatError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return "An unexpected error occurred";
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  // Get auth token
  getAuthToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  // Set auth token
  setAuthToken: (token: string): void => {
    localStorage.setItem("authToken", token);
  },

  // Remove auth token
  removeAuthToken: (): void => {
    localStorage.removeItem("authToken");
  },
};

// Export default API object
export default {
  batch: batchAPI,
  collector: collectorAPI,
  herb: herbAPI,
  lab: labAPI,
  ipfs: ipfsAPI,
  blockchain: blockchainAPI,
  qr: qrAPI,
  analytics: analyticsAPI,
  utils,
};
