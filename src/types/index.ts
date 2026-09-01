// Core type definitions for Help for Education

export type UserRole = "admin" | "customer" | "teacher";

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  photoURL?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  screenshots: string[];
  features: string[];
  bonuses: string[];
  version: string;
  releaseDate: string;
  fileSize: string;
  releaseNotes: string;
  downloadUrl: string; // External download link (Google Drive, Dropbox, Mega, etc.)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LicenseStatus = "unused" | "redeemed";

export interface License {
  id: string;
  key: string;
  productId: string;
  productName?: string;
  status: LicenseStatus;
  redeemedBy?: string;
  redeemedByEmail?: string;
  redeemedAt?: string;
  redeemedIp?: string;
  createdAt: string;
  createdBy: string;
}

export interface Download {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  productName: string;
  licenseId: string;
  downloadDate: string;
  ipAddress: string;
  downloadCount: number;
  latestDownload?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
}

export interface Settings {
  id: string;
  websiteName: string;
  logo: string;
  favicon: string;
  footerText: string;
  contactEmail: string;
  facebookPage: string;
  gcashNumber: string;
  gcashQrImage: string;
}

export interface CheckoutData {
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  gcashReference: string;
  paymentProof?: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  redeemedKeys: number;
  unusedKeys: number;
  totalDownloads: number;
  recentUsers: AppUser[];
  recentDownloads: Download[];
  recentActivity: ActivityLog[];
}
