// Core entity types for TrueRoots platform

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  region?: string;
  country?: string;
}

export interface Collector {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: Location;
  profileImage?: string;
  communityName?: string;
  certifications: string[];
  joinedDate: string;
  totalCollections: number;
  rating: number;
  isVerified: boolean;
}

export interface Herb {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  image?: string;
  properties: string[];
  harvestSeason: string[];
  region: string[];
}

export type BatchStatus = 'collected' | 'delivered' | 'verified' | 'formulated';

export interface Batch {
  id: string;
  herbId: string;
  herb: Herb;
  collectorId: string;
  collector: Collector;
  status: BatchStatus;
  quantity: number;
  unit: string;
  collectionDate: string;
  location: Location;
  images: string[];
  qrCode: string;
  blockchainTxHash?: string;
  ipfsHash?: string;
  paymentProof?: PaymentProof;
  labResults?: LabResult[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentProof {
  id: string;
  batchId: string;
  amount: number;
  currency: string;
  transactionHash: string;
  paymentDate: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface LabResult {
  id: string;
  batchId: string;
  labName: string;
  testType: string;
  testDate: string;
  results: {
    [key: string]: any;
  };
  certificateUrl: string;
  ipfsHash: string;
  isCompliant: boolean;
  notes?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TimelineEvent {
  id: string;
  batchId: string;
  type: 'collection' | 'delivery' | 'verification' | 'lab_test' | 'formulation' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  location?: Location;
  actor: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface Enterprise {
  id: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'retailer';
  logo?: string;
  description: string;
  location: Location;
  certifications: string[];
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'collector' | 'enterprise' | 'lab' | 'admin';
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface CollectionFormData {
  herbId: string;
  quantity: number;
  unit: string;
  images: File[];
  notes?: string;
}

export interface LabTestFormData {
  batchId: string;
  testType: string;
  testFile: File;
  notes?: string;
}

// Chat types for AI assistant
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  metadata?: {
    batchId?: string;
    herbId?: string;
    [key: string]: any;
  };
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  context?: {
    batchId?: string;
    herbId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

// QR Code scanning types
export interface QRScanResult {
  batchId: string;
  isValid: boolean;
  error?: string;
}

// Upload types
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
