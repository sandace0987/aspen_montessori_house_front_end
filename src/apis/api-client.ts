import { API_PARENT_LINK } from "@/lib/constants";

// ==========================================
// 1. Data Model Types (Matching Documentation)
// ==========================================

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextResponse {
  profile: Profile;
  roles: string[];
}

export interface SyncProfileRequest {
  full_name: string;
  phone: string;
}

export interface ProfileCreate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  roles: string[];
}

export interface ProfileInviteRequest {
  full_name: string;
  email: string;
  phone?: string;
  roles: string[];
}

export interface RoleAssignmentRequest {
  roles: string[];
}

export interface StudentCreate {
  admission_number: string;
  student_name: string;
  date_of_birth: string;
  class_name: string;
  academic_year: string;
  joining_date: string;
  parent_id: string;
  discount_type: "percentage" | "fixed" | null;
  discount_value: number;
  notes?: string;
  is_active: boolean;
}

export interface StudentUpdate {
  admission_number?: string;
  student_name?: string;
  date_of_birth?: string;
  class_name?: string;
  academic_year?: string;
  joining_date?: string;
  parent_id?: string;
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number;
  notes?: string;
}

export interface StudentDiscountUpdate {
  discount_type: "percentage" | "fixed" | null;
  discount_value: number;
}

export interface StudentResponse {
  id: number;
  admission_number: string;
  student_name: string;
  date_of_birth: string;
  class_name: string;
  academic_year: string;
  joining_date: string;
  parent_id: string;
  discount_type: "percentage" | "fixed" | null;
  discount_value: string | number;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeePlanCreate {
  class_name: string;
  program_type: string;
  tuition_fee: number;
  resource_fee: number;
  frequency: "monthly" | "quarterly" | "yearly";
  description?: string;
  is_active: boolean;
}

export interface FeePlanResponse {
  id: number;
  class_name: string;
  program_type: string;
  tuition_fee: string;
  resource_fee: string;
  frequency: "monthly" | "quarterly" | "yearly";
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface FeePlanUpdate {
  class_name: string;
  program_type: string;
  tuition_fee: number;
  resource_fee: number;
  frequency: "monthly" | "quarterly" | "yearly";
  description?: string;
  is_active: boolean;
}

export interface FeeRuleCreate {
  rule_name: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  applies_to: "monthly" | "quarterly" | "yearly";
  is_active: boolean;
}

export interface FeeRuleResponse {
  id: number;
  rule_name: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  applies_to: "monthly" | "quarterly" | "yearly";
  is_active: boolean;
}

export interface FeeAccountCreate {
  student_id: number;
  fee_plan_id: number;
  payment_cycle: "monthly" | "quarterly" | "yearly";
  effective_from: string;
  is_active: boolean;
  installments?: number;
}

export interface FeeAccountResponse {
  id: number;
  student_id: number;
  fee_plan_id: number;
  payment_cycle: "monthly" | "quarterly" | "yearly";
  effective_from: string;
  is_active: boolean;
  installments: number;
  created_at: string;
}

export interface FeeAccountUpdate {
  fee_plan_id?: number;
  payment_cycle?: "monthly" | "quarterly" | "yearly";
  effective_from?: string;
  is_active?: boolean;
  installments?: number;
}

export interface FeeDueGenerateRequest {
  fee_account_id: number;
  period_start: string;
  starting_installment: number;
  installment_count: number;
  first_due_date: string;
  remarks?: string;
}

export interface FeeDueResponse {
  id: number;
  student_id: number;
  fee_account_id: number;
  due_title: string;
  tuition_fee: string;
  resource_fee: string;
  original_amount: string;
  discount_applied: string;
  final_amount: string;
  due_start_date: string;
  due_end_date: string;
  due_date: string;
  status: "pending" | "partial" | "paid" | "overdue";
  remarks: string;
  created_at: string;
  paid_amount: string;
  balance: string;
}

export interface ParentDashboardResponse {
  students: StudentResponse[];
  dues: FeeDueResponse[];
  recent_payments: PaymentResponse[];
  total_outstanding: string;
}

export interface PaymentOrderCreate {
  fee_due_id: number;
  amount: number;
  remarks?: string;
}

export interface PaymentOrderResponse {
  payment_id: number;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface RazorpayVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentResponse {
  id: number;
  student_id: number;
  fee_due_id: number;
  amount_paid: string;
  payment_mode: "cash" | "upi" | "online_gateway" | "bank_transfer";
  payment_gateway: string | null;
  gateway_order_id: string | null;
  gateway_payment_id: string | null;
  remarks: string;
  collected_by: string | null;
  status: "success" | "failed" | "pending";
  paid_at: string;
  created_at: string;
}

export interface ManualPaymentCreate {
  fee_due_id: number;
  amount_paid: number;
  payment_mode: "cash" | "upi" | "bank_transfer";
  remarks?: string;
}

export interface AdminDashboardResponse {
  as_of: string;
  total_students: {
    total: number;
    added_this_month: number;
  };
  active_parents: {
    total: number;
    added_this_month: number;
  };
  revenue: {
    amount: string;
    period_start: string;
    previous_amount: string;
    previous_period_start: string;
    percent_change: string;
  };
  new_admissions: {
    total: number;
    quarter_start: string;
  };
  recent_students: Array<{
    id: number;
    name: string;
    program: string;
    status: string;
    fee_status: string;
  }>;
}

export interface TokenRequest {
  user_id: string;
  email: string;
  role: "authenticated" | "anonymous";
  expires_in?: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// ==========================================
// 2. Centralized Production API Fetch Engine
// ==========================================

export class APIClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("aspen_auth_token");
  }

  public setToken(token: string | null) {
    this.token = token;
    console.debug("[APIClient] setToken called. Value exists:", !!token);
    if (token) {
      localStorage.setItem("aspen_auth_token", token);
    } else {
      localStorage.removeItem("aspen_auth_token");
    }
  }

  // Compatibility stubs for simulation UI toggles in context
  public enableSimulation(_enable: boolean) {
    // Stubbed: local mock simulation database removed in production mode
  }

  public getSimulationStatus(): boolean {
    return false; // Always false: connect directly to backend endpoints
  }

  private getFallbackToken(): string | null {
    try {
      const sessionStr = localStorage.getItem("aspen_supabase_session");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const token = session?.access_token || session?.currentSession?.access_token;
        if (token) return token;
      }
    } catch (e) {
      console.error("Failed to parse Supabase session storage:", e);
    }
    const token = localStorage.getItem("aspen_auth_token");
    console.debug("[APIClient] getFallbackToken called. Returning:", token ? "Token present" : "null");
    return token;
  }


  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const activeToken = this.token || this.getFallbackToken();
    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    } else {
      console.warn("[APIClient] activeToken is null or empty. No Authorization header will be sent.");
    }
    return headers;
  }


  private async request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: any
  ): Promise<T> {
    const response = await fetch(`${API_PARENT_LINK}${path}`, {
      method,
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let cleanErrorMessage = "";
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          if (Array.isArray(errorJson.error.details) && errorJson.error.details.length > 0) {
            cleanErrorMessage = errorJson.error.details.map((d: any) => d.msg).join(", ");
          } else {
            cleanErrorMessage = errorJson.error.message || "";
          }
        } else if (Array.isArray(errorJson.detail)) {
          cleanErrorMessage = errorJson.detail.map((d: any) => `${d.loc.join(".")}: ${d.msg}`).join(", ");
        } else {
          cleanErrorMessage = errorJson.detail || errorJson.message || "";
        }
      } catch {
        // Not a JSON string, fallback
      }
      throw new Error(cleanErrorMessage || errorText || `API Error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  // ==========================================
  // AUTHENTICATION APIs
  // ==========================================

  public async getMe(): Promise<AuthContextResponse> {
    return this.request<AuthContextResponse>("GET", "/api/v1/auth/me");
  }

  public async getRoles(): Promise<string[]> {
    return this.request<string[]>("GET", "/api/v1/auth/roles");
  }

  public async syncProfile(req: SyncProfileRequest): Promise<Profile> {
    return this.request<Profile>("POST", "/api/v1/auth/sync-profile", req);
  }

  // ==========================================
  // DEV TOOLS ONLY (TOKEN GENERATOR)
  // ==========================================

  public async generateMockToken(req: TokenRequest): Promise<TokenResponse> {
    return this.request<TokenResponse>("POST", "/api/v1/supabase/token", req);
  }

  // ==========================================
  // PARENT PORTAL APIs
  // ==========================================

  public async getParentDashboard(): Promise<ParentDashboardResponse> {
    return this.request<ParentDashboardResponse>("GET", "/api/v1/parent/dashboard");
  }

  public async getParentStudents(): Promise<StudentResponse[]> {
    return this.request<StudentResponse[]>("GET", "/api/v1/parent/students");
  }

  public async getParentFees(): Promise<FeeDueResponse[]> {
    return this.request<FeeDueResponse[]>("GET", "/api/v1/parent/fees");
  }

  public async getParentPayments(): Promise<PaymentResponse[]> {
    return this.request<PaymentResponse[]>("GET", "/api/v1/parent/payments");
  }

  public async createPaymentIntent(req: PaymentOrderCreate): Promise<PaymentOrderResponse> {
    return this.request<PaymentOrderResponse>("POST", "/api/v1/parent/payment-intent", req);
  }

  public async verifyPayment(req: RazorpayVerifyRequest): Promise<PaymentResponse> {
    return this.request<PaymentResponse>("POST", "/api/v1/parent/payment/verify", req);
  }



  // ==========================================
  // ADMIN PORTAL APIs
  // ==========================================

  public async getAdminDashboard(asOf?: string, recentLimit = 5): Promise<AdminDashboardResponse> {
    const params = new URLSearchParams();
    if (asOf) params.append("as_of", asOf);
    params.append("recent_limit", String(recentLimit));
    return this.request<AdminDashboardResponse>("GET", `/api/v1/admin/dashboard?${params.toString()}`);
  }

  public async getAdminStudents(activeOnly: boolean = false): Promise<StudentResponse[]> {
    return this.request<StudentResponse[]>("GET", `/api/v1/admin/students?active_only=${activeOnly}`);
  }

  public async getAdminFees(): Promise<FeeDueResponse[]> {
    return this.request<FeeDueResponse[]>("GET", "/api/v1/admin/fee-dues");
  }

  public async getProfiles(activeOnly: boolean = false): Promise<Profile[]> {
    const query = activeOnly ? "?active_only=true" : "";
    return this.request<Profile[]>("GET", `/api/v1/admin/profiles${query}`);
  }

  public async createProfile(req: ProfileCreate): Promise<Profile> {
    return this.request<Profile>("POST", "/api/v1/admin/profiles", req);
  }

  public async updateProfileRoles(profileId: string, req: RoleAssignmentRequest): Promise<AuthContextResponse> {
    return this.request<AuthContextResponse>("POST", `/api/v1/admin/profiles/${profileId}/roles`, req);
  }

  public async updateProfile(profileId: string, req: Partial<ProfileCreate>): Promise<Profile> {
    return this.request<Profile>("PUT", `/api/v1/admin/profiles/${profileId}`, req);
  }

  public async deactivateProfile(profileId: string): Promise<Profile> {
    return this.request<Profile>("DELETE", `/api/v1/admin/profiles/${profileId}`);
  }

  public async activateProfile(profileId: string): Promise<Profile> {
    return this.request<Profile>("PATCH", `/api/v1/admin/profiles/${profileId}/activate`);
  }

  public async inviteProfile(payload: ProfileInviteRequest): Promise<Profile> {
    return this.request<Profile>("POST", "/api/v1/admin/profiles/invite", payload);
  }

  public async resendInvite(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("POST", "/api/v1/admin/profiles/resend-invite", { email });
  }

  public async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("POST", "/api/v1/auth/forgot-password", { email });
  }

  public async updatePassword(password: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("POST", "/api/v1/auth/update-password", { password });
  }

  public async createStudent(req: StudentCreate): Promise<StudentResponse> {
    return this.request<StudentResponse>("POST", "/api/v1/admin/students", req);
  }

  public async updateStudent(studentId: number, req: StudentUpdate): Promise<StudentResponse> {
    return this.request<StudentResponse>("PUT", `/api/v1/admin/students/${studentId}`, req);
  }

  public async deactivateStudent(studentId: number): Promise<StudentResponse> {
    return this.request<StudentResponse>("DELETE", `/api/v1/admin/students/${studentId}`);
  }

  public async activateStudent(studentId: number): Promise<StudentResponse> {
    return this.request<StudentResponse>("PATCH", `/api/v1/admin/students/${studentId}/activate`);
  }

  public async updateStudentDiscount(studentId: number, req: StudentDiscountUpdate): Promise<StudentResponse> {
    return this.request<StudentResponse>("PATCH", `/api/v1/admin/students/${studentId}/discount`, req);
  }

  public async getFeePlans(): Promise<FeePlanResponse[]> {
    return this.request<FeePlanResponse[]>("GET", "/api/v1/admin/fee-plans");
  }

  public async createFeePlan(req: FeePlanCreate): Promise<FeePlanResponse> {
    return this.request<FeePlanResponse>("POST", "/api/v1/admin/fee-plans", req);
  }

  public async updateFeePlan(planId: number, req: FeePlanUpdate): Promise<FeePlanResponse> {
    return this.request<FeePlanResponse>("PUT", `/api/v1/admin/fee-plans/${planId}`, req);
  }

  public async deleteFeePlan(planId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>("DELETE", `/api/v1/admin/fee-plans/${planId}`);
  }

  public async toggleFeePlanActive(planId: number): Promise<FeePlanResponse> {
    return this.request<FeePlanResponse>("PATCH", `/api/v1/admin/fee-plans/${planId}/toggle-active`);
  }

  public async createFeeRule(req: FeeRuleCreate): Promise<FeeRuleResponse> {
    return this.request<FeeRuleResponse>("POST", "/api/v1/admin/fee-rules", req);
  }

  public async getFeeRules(): Promise<FeeRuleResponse[]> {
    return this.request<FeeRuleResponse[]>("GET", "/api/v1/admin/fee-rules");
  }

  public async createFeeAccount(req: FeeAccountCreate): Promise<FeeAccountResponse> {
    return this.request<FeeAccountResponse>("POST", "/api/v1/admin/fee-accounts", req);
  }

  public async updateFeeAccount(accountId: number, req: FeeAccountUpdate): Promise<FeeAccountResponse> {
    return this.request<FeeAccountResponse>("PATCH", `/api/v1/admin/student-fee-account/${accountId}`, req);
  }

  public async deleteFeeAccount(accountId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>("DELETE", `/api/v1/admin/student-fee-account/${accountId}`);
  }

  public async getFeeAccounts(): Promise<FeeAccountResponse[]> {
    return this.request<FeeAccountResponse[]>("GET", "/api/v1/admin/fee-accounts");
  }

  public async generateFeeDues(req: FeeDueGenerateRequest): Promise<FeeDueResponse[]> {
    return this.request<FeeDueResponse[]>("POST", "/api/v1/admin/fee-dues/generate", req);
  }

  public async recordManualPayment(req: ManualPaymentCreate): Promise<PaymentResponse> {
    return this.request<PaymentResponse>("POST", "/api/v1/admin/payments/manual", req);
  }

  public async deleteFeeDue(dueId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>("DELETE", `/api/v1/admin/fee-dues/${dueId}`);
  }
}

export const api = new APIClient();
