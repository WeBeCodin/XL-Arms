export interface RSRProduct {
  rsrStockNumber: string;
  upcCode: string;
  description: string;
  departmentNumber: number;
  departmentName?: string;
  manufacturerId: string;
  manufacturerName?: string;
  price: number;
  retailPrice?: number;
  quantityOnHand: number;
  weight?: number;
  length?: string;
  width?: string;
  height?: string;
  imageUrl?: string;
  category?: string;
  subcategory?: string;
  model?: string;
  caliber?: string;
  capacity?: number;
  action?: string;
  barrelLength?: string;
  finish?: string;
  stock?: string;
  sights?: string;
  safetyFeatures?: string;
  accessories?: string;
  warranty?: string;
  countryOfOrigin?: string;
  federalExciseTax?: number;
  shippingWeight?: number;
  shippingLength?: string;
  shippingWidth?: string;
  shippingHeight?: string;
  hazmat?: boolean;
  freeShipping?: boolean;
  dropShip?: boolean;
  allocation?: boolean;
  newItem?: boolean;
  closeout?: boolean;
  lastUpdated?: Date;
}

export interface RSRInventoryItem {
  rsrStockNumber: string;
  upcCode: string;
  description: string;
  departmentNumber: number;
  manufacturerId: string;
  manufacturerName: string;
  price: number;
  retailPrice: number;
  quantityOnHand: number;
  weight: number;
  length: string;
  width: string;
  height: string;
  imageUrl: string;
  category: string;
  subcategory: string;
  model: string;
  caliber: string;
  capacity: number;
  action: string;
  barrelLength: string;
  finish: string;
  stock: string;
  sights: string;
  safetyFeatures: string;
  accessories: string;
  warranty: string;
  countryOfOrigin: string;
  federalExciseTax: number;
  shippingWeight: number;
  shippingLength: string;
  shippingWidth: string;
  shippingHeight: string;
  hazmat: boolean;
  freeShipping: boolean;
  dropShip: boolean;
  allocation: boolean;
  newItem: boolean;
  closeout: boolean;
  lastUpdated: Date;
}

export interface RSRSyncResponse {
  success: boolean;
  recordsProcessed: number;
  recordsUpdated: number;
  recordsAdded: number;
  errors: string[];
  syncDate: Date;
  processingTime: number;
}

export interface RSRProductsResponse {
  products: RSRProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}