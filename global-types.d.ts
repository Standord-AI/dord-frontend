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
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
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
  AccentColor: string | null;
  BusinessAddress: Address;
  LandingPageDesign: string;
  SecondaryBannerURL: string | null;
  LandingPageTitle: string | null;
  LandingPageDescription: string | null;
}

export interface UpdateTenantPayload {
  Name?: string;
  Description?: string;
  BusinessEmail?: string;
  BusinessPhone?: string;
  LogoURL?: string;
  BannerURL?: string;
  PrimaryColor?: string;
  SecondaryColor?: string;
  AccentColor?: string;
  BusinessAddress?: Address;
  LandingPageDesign?: string;
  SecondaryBannerURL?: string;
  LandingPageTitle?: string;
  LandingPageDescription?: string;
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

export interface ProductImage {
  ID: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  ProductID: number;
  URL: string;
  IsMain: boolean;
  ImageDescription?: string;
}

export interface ProductCategory {
  ID: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  TenantID: string;
  Name: string;
  Description?: string;
}

export interface Product {
  ID: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  TenantID: string;
  Name: string;
  Description?: string;
  Images?: ProductImage[] | null;
  Category?: string;
  Rating: number;
  NumberOfReviews: number;
  Price: number;
  Stock: number;
  IsActive: boolean;
  IsFeatured: boolean;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  rating: number;
  numberOfReviews: number;
  price: number;
  stock: number;

  Images: {
    url: string;
    is_main: boolean;
    image_description?: string;
  }[];
}

export interface ImagePayload {
  url: string;
  is_main: boolean;
  image_description?: string;
}

export interface UpdateImagePayload {
  url?: string;
  is_main?: boolean;
  image_description?: string;
}

export interface UpdateProductPayload {
  Name?: string;
  Description?: string;
  Category?: string;
  Rating?: number;
  NumberOfReviews?: number;
  Price?: number;
  Stock?: number;
  IsFeatured?: boolean;
}

export interface Category {
  ID: number;
  Name: string;
  Description: string;
}

export interface ProductVariantImage {
  ID: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  VariantID: number;
  URL: string;
  IsMain: boolean;
  ImageDescription?: string;
}

export interface ProductVariant {
  ID: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  ProductID: number;
  TenantID: string;
  VariantName: string;
  PriceOverride: number;
  Stock: number;
  IsActive: boolean;
  Images?: ProductVariantImage[] | null;
}

export interface CreateVariantPayload {
  VariantName: string;
  PriceOverride: number;
  Stock: number;
}

export interface UpdateVariantPayload {
  variantName?: string;
  price?: number;
  stock?: number;
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

export interface Payment {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  TenantID: string;
  OrderID: number;
  UserID: number;
  PaymentMethod: string;
  PaymentProvider: string;
  TransactionID: string;
  Amount: number;
  Currency: string;
  Status: string;
  PaymentDate: string;
  ReceiptURL: string;
  Notes: string;
}

export interface TenantSettings {
  tenant_id: string;
  name: string;
  slug: string;
  owner_id: number;
  business_email: string;
  business_phone: string;
  description: string;
  plan_type: string;
  logo_url: string;
  banner_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  business_address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  is_active: boolean;
  // Bank details (optional as they are not in the current JSON response)
  bank_name?: string;
  account_holder_name?: string;
  branch_name?: string;
  account_number?: string;
}

export interface BankAccount {
  ID: number;
  TenantID: string;
  BankName: string;
  Branch: string;
  AccountHolder: string;
  AccountNumber: string;
  IsDefault: boolean;
}

export interface Customer {
  id: number;
  tenant_id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  first_purchase_date: string;
  last_purchase_date: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  status: string;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  total_revenue: number;
  average_order_value: number;
}

export interface GetCustomersResponse {
  message: string;
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Agent Configuration Types
export interface Agent {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  TenantID: string;
  N8NWebhookURL: string;
  N8NInstanceID: string;
  AutomationStatus: string;
  DordEnabled: boolean;
  AgentName: string;
  AgentPersona: string;
  AgentDescription: string | null;
  LLMModel: string;
  TokenUsageLimit: number;
  TokenUsageCurrent: number;
  LastAutomationTrigger: string;
}

export type AgentType = "sales" | "support" | "general";
export type ToneType = "friendly" | "professional" | "casual";
export type EmojiUsage = "none" | "low" | "medium";
export type LanguageCode = "en" | "si" | "ta";
export type DiscountPolicy = "never" | "allowed" | "approval";

export interface AgentConfigInput {
  agentName: string;
  agentType: AgentType;
  tone: ToneType;
  verbosity: 1 | 2 | 3 | 4 | 5;
  emojiUsage: EmojiUsage;
  language: LanguageCode;
  businessDescription: string;
  allowedActions: string[];
  discountPolicy: DiscountPolicy;
  maxDiscountPercent?: number;
  greetingMessage: string;
  escalationMessage: string;
  customInstructions?: string;
}

export interface UpdateAgentPayload {
  AgentName?: string;
  AgentPersona?: string;
  AgentDescription?: string;
  DordEnabled?: boolean;
  LLMModel?: string;
}
