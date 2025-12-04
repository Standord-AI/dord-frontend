export type UserRole = "user" | "merchant";

export interface SignupPayload {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Role: UserRole;
}

export interface LoginPayload {
  Email: string;
  Password: string;
}

export interface User {
  TenantID: string;
  Slug?: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Role: UserRole;
  IsActive: boolean;
}

export interface Tenant {
  TenantID: string;
  Name: string;
  Slug: string;
  OwnerID: number;
  BusinessEmail: string;
  BusinessPhone: string;
  Description: string;
  IsActive: boolean;
  PlanType: string;
  LogoURL: string | null;
  BannerURL: string | null;
  PrimaryColor: string | null;
  SecondaryColor: string | null;
}

export interface MerchantSignupPayload {
  name: string;
  slug: string;
  ownerId: string;
  businessEmail: string;
  businessPhone: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: User | Tenant;
  error?: string;
}

export interface Product {
  ID: number;
  Name: string;
  Description: string;
  Price: number;
  Stock: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  rating: number;
  numberOfReviews: number;
  price: number;
  stock: number;
}

export interface Category {
  ID: number;
  Name: string;
  Description: string;
}

export interface ProductVariant {
  ID: number;
  ProductID: number;
  VariantName: string;
  PriceOverride: number;
  Stock: number;
  IsActive: boolean;
}

export interface CreateVariantPayload {
  VariantName: string;
  PriceOverride: number;
  Stock: number;
}

export interface RequestCategoryPayload {
  Name: string;
  Description: string;
  Note: string;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  TenantID: string;
  UserID: number;
  CartID: number;
  TotalAmount: number;
  Status: string;
  PaymentMethod: string;
  ShippingAddress: Address;
  BillingAddress: Address;
}

export interface AbandonedCart {
  cart_id: number;
  user_id: number;
  total_price: number;
  updated_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_phone: string;
}
