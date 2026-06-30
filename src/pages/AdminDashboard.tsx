import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/use-page-meta";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  TrendingUp,
  UserPlus,
  DollarSign,
  GraduationCap,
  Home,
  LogOut,
  Sun,
  Moon,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Plus,
  BookOpen,
  Calendar,
  AlertCircle,
  Database,
  RefreshCw,
  Edit,
  Pencil,
  Trash2,
  Percent,
  Calculator,
  Save,
  CheckCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  Mail,
  Tag
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/context/AuthContext";
import {
  api,
  AdminDashboardResponse,
  StudentResponse,
  Profile,
  FeePlanResponse,
  FeeAccountResponse,
  FeeDueResponse,
  FeeRuleResponse,
  FeeRuleCreate
} from "@/apis/api-client";
import aspenLogo from "@/assets/aspen-logo.png";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import ComingSoonPage from "@/components/ComingSoonPage";
import { toast } from "sonner";

type TabType = "dashboard" | "admins" | "students" | "parents" | "plans" | "accounts" | "dues" | "payments";

export default function AdminDashboard() {
  usePageMeta("Admin Dashboard – Aspen Montessori", undefined, { noindex: true });

  const {
    user,
    roles,
    isAuthenticated,
    isSimulation,
    isLoading: authLoading,
    login,
    logout
  } = useAuth();

  const navigate = useNavigate();

  // Navigation and layout states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [duesPage, setDuesPage] = useState(1);
  const [hideInactiveStudents, setHideInactiveStudents] = useState(false);
  const [hideInactiveParents, setHideInactiveParents] = useState(false);
  const [hideInactiveAdmins, setHideInactiveAdmins] = useState(false);
  const [hideInactivePlans, setHideInactivePlans] = useState(false);
  const [hideInactiveRules, setHideInactiveRules] = useState(false);
  const [hideInactiveAccounts, setHideInactiveAccounts] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [parentSearch, setParentSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [planSearch, setPlanSearch] = useState("");
  const [accountSearch, setAccountSearch] = useState("");
  const [ruleSearch, setRuleSearch] = useState("");
  const [dueSearch, setDueSearch] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Admin login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Forgot password & reset password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(() => {
    const hash = window.location.hash || "";
    const searchParams = new URLSearchParams(window.location.search);
    return hash.includes("type=recovery") ||
           hash.includes("type=invite") ||
           hash.includes("type=signup") ||
           searchParams.get("type") === "recovery" ||
           searchParams.get("type") === "invite" ||
           searchParams.get("type") === "signup";
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Data fetching states
  const [dashboardMetrics, setDashboardMetrics] = useState<AdminDashboardResponse | null>(null);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [feePlans, setFeePlans] = useState<FeePlanResponse[]>([]);
  const [feeRules, setFeeRules] = useState<FeeRuleResponse[]>([]);
  const [feeAccounts, setFeeAccounts] = useState<FeeAccountResponse[]>([]);
  const [openDues, setOpenDues] = useState<FeeDueResponse[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [showRevenue, setShowRevenue] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // View Details Modal States
  const [selectedStudentForView, setSelectedStudentForView] = useState<StudentResponse | null>(null);
  const [selectedParentForView, setSelectedParentForView] = useState<Profile | null>(null);

  // Form inputs
  // Student form
  const [studentForm, setStudentForm] = useState({
    admission_number: "",
    student_name: "",
    date_of_birth: "",
    class_name: "Montessori-1",
    academic_year: "2026-2027",
    joining_date: new Date().toISOString().split("T")[0],
    parent_id: "",
    discount_type: "percentage" as "percentage" | "fixed" | null,
    discount_value: 0,
    notes: ""
  });

  // Parent form
  const [parentForm, setParentForm] = useState({
    id: "", // uuid
    full_name: "",
    email: "",
    phone: "",
    roles: ["parent"]
  });

  // Admin form
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [adminForm, setAdminForm] = useState({
    id: "", // uuid
    full_name: "",
    email: "",
    phone: "",
    roles: ["admin"]
  });

  // Fee plan form
  const [planForm, setPlanForm] = useState({
    class_name: "",
    program_type: "",
    tuition_fee: 0,
    resource_fee: 0,
    frequency: "quarterly" as "monthly" | "quarterly" | "yearly",
    description: ""
  });

  // Fee rule form
  const [ruleForm, setRuleForm] = useState({
    rule_name: "",
    discount_type: "fixed" as "fixed" | "percentage",
    discount_value: 0,
    applies_to: "yearly" as "monthly" | "quarterly" | "yearly",
    is_active: true
  });

  // Student Fee Account subscription form
  const [accountForm, setAccountForm] = useState({
    student_id: 0,
    fee_plan_id: 0,
    payment_cycle: "quarterly" as "monthly" | "quarterly" | "yearly",
    effective_from: new Date().toISOString().split("T")[0],
    installments: 3
  });

  // Fee dues generator form
  const [generateForm, setGenerateForm] = useState({
    fee_account_id: 0,
    period_start: new Date().toISOString().split("T")[0],
    starting_installment: 1,
    installment_count: 3,
    first_due_date: new Date().toISOString().split("T")[0],
    remarks: ""
  });

  // Selected student ID for manual payment form
  const [paymentSelectedStudentId, setPaymentSelectedStudentId] = useState<number>(0);

  // Set of student IDs currently expanded in the dues ledger
  const [expandedStudentIds, setExpandedStudentIds] = useState<Record<number, boolean>>({});

  // Manual payment form
  const [paymentForm, setPaymentForm] = useState({
    fee_due_id: 0,
    amount_paid: 0,
    payment_mode: "cash" as "cash" | "upi" | "bank_transfer",
    remarks: ""
  });

  // Fetch all administrative records
  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    try {
      const metrics = await api.getAdminDashboard();
      setDashboardMetrics(metrics);

      const allStudents = await api.getAdminStudents(false);
      setStudents(allStudents);

      const allProfiles = await api.getProfiles(false);
      setProfiles(allProfiles);

      const plans = await api.getFeePlans();
      setFeePlans(plans);

      const rules = await api.getFeeRules();
      setFeeRules(rules);

      const accounts = await api.getFeeAccounts();
      setFeeAccounts(accounts);

      const duesList = await api.getAdminFees();
      setOpenDues(duesList.filter(d => d.status !== "paid"));
    } catch (err: any) {
      console.error("Failed to load admin logs", err);
      toast.error("Error synchronizing administrative datasets.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      const hash = window.location.hash || "";
      const searchParams = new URLSearchParams(window.location.search);
      const isRecovery = hash.includes("type=recovery") || searchParams.get("type") === "recovery";
      const isInvite = hash.includes("type=invite") || searchParams.get("type") === "invite";
      const isSignup = hash.includes("type=signup") || searchParams.get("type") === "signup";
      if (isResetMode || isRecovery || isInvite || isSignup) {
        return;
      }

      // Guard: wait until roles state is populated to prevent race condition on login
      if (roles.length === 0) return;

      const hasAdmin = roles.includes("admin");
      if (!hasAdmin) {
        logout();
        setLoginError("Access Denied: You do not have administrative privileges.");
      } else {
        fetchAllData();
      }
    }
  }, [isAuthenticated, isResetMode, authLoading, roles]);

  useEffect(() => {
    // Check if URL has recovery tokens in hash or query search parameters
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    
    const isRecovery = hash.includes("type=recovery") || searchParams.get("type") === "recovery";
    const isInvite = hash.includes("type=invite") || searchParams.get("type") === "invite";
    const isSignup = hash.includes("type=signup") || searchParams.get("type") === "signup";
    
    if (isRecovery || isInvite || isSignup) {
      setIsResetMode(true);
    }
    
    // Also listen to PASSWORD_RECOVERY event from Supabase locally
    const handleAuthChange = async () => {
      const { supabase } = await import("@/lib/supabase");
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsResetMode(true);
        }
      });
      return subscription;
    };
    
    const subPromise = handleAuthChange();
    return () => {
      subPromise.then(sub => sub.unsubscribe());
    };
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setLoginError("Please enter your email address");
      return;
    }
    setLoginError("");
    setForgotLoading(true);
    setForgotSuccess(false);

    try {
      await api.forgotPassword(forgotEmail.trim());
      setForgotSuccess(true);
      setForgotEmail("");
    } catch (err: any) {
      setLoginError(err.message || "Failed to trigger password reset");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setLoginError("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setLoginError("Password must contain at least one uppercase letter (capital)");
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setLoginError("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setLoginError("Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setLoginError("Password must contain at least one special character (e.g. !, @, #, $, etc.)");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLoginError("Passwords do not match");
      return;
    }
    setLoginError("");
    setResetLoading(true);

    try {
      await api.updatePassword(newPassword);
      await logout();
      toast.success("Password updated successfully! Please sign in.");
      setIsResetMode(false);
      setNewPassword("");
      setConfirmPassword("");
      // Clean URL hashes and navigate to portal
      window.location.hash = "";
      window.location.search = "";
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setLoginError(err.message || "Failed to update password");
    } finally {
      setResetLoading(false);
    }
  };

  if (!FEATURE_FLAGS.adminPortalEnabled) {
    return <ComingSoonPage title="Admin Portal" />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-muted-foreground animate-pulse">Loading admin center...</p>
        </div>
      </div>
    );
  }

  // Guard: Admin Portal requires active user with admin role
  const isAdmin = isAuthenticated && roles.includes("admin");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setLoginError("Please enter your email");
      return;
    }
    
    let email = username.trim();
    if (!email.includes("@")) {
      email = email + "@gmail.com";
      setUsername(email);
    }
    
    if (!password) {
      setLoginError("Please enter your password");
      return;
    }
    setLoginError("");
    setLoginLoading(true);

    const success = await login(email, password);
    setLoginLoading(false);

    if (!success) {
      setLoginError("Sign-in failed. Please check your credentials and try again.");
    }
  };

  // Onboard student action
  const handleOnboardStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const admissionClean = studentForm.admission_number.trim();
      const nameClean = studentForm.student_name.trim();

      if (!admissionClean || !nameClean || !studentForm.parent_id) {
        toast.error("Admission number, student name and parent profile are mandatory.");
        return;
      }

      if (admissionClean.length < 3) {
        toast.error("Admission number must be at least 3 characters long.");
        return;
      }

      if (!/^[a-zA-Z0-9\s\/-]+$/.test(admissionClean)) {
        toast.error("Admission number can only contain alphanumeric characters, hyphens, slashes, and spaces.");
        return;
      }

      if (nameClean.length < 3) {
        toast.error("Student full name must be at least 3 characters long.");
        return;
      }

      if (!/^[a-zA-Z\s.-]+$/.test(nameClean)) {
        toast.error("Student name can only contain letters, spaces, dots, and hyphens.");
        return;
      }

      if (!studentForm.date_of_birth) {
        toast.error("Student date of birth is required.");
        return;
      }

      const dob = new Date(studentForm.date_of_birth);
      if (isNaN(dob.getTime()) || dob > new Date()) {
        toast.error("Please enter a valid date of birth in the past.");
        return;
      }

      if (studentForm.discount_value < 0) {
        toast.error("Discount value cannot be negative.");
        return;
      }

      if (studentForm.discount_type === "percentage" && studentForm.discount_value > 100) {
        toast.error("Percentage discount cannot exceed 100%.");
        return;
      }

      if (editingStudentId) {
        await api.updateStudent(editingStudentId, {
          admission_number: admissionClean,
          student_name: nameClean,
          date_of_birth: studentForm.date_of_birth,
          class_name: studentForm.class_name,
          academic_year: studentForm.academic_year,
          joining_date: studentForm.joining_date,
          parent_id: studentForm.parent_id,
          discount_type: studentForm.discount_value > 0 ? studentForm.discount_type : null,
          discount_value: studentForm.discount_value,
          notes: studentForm.notes.trim()
        });
        toast.success("Student profile updated successfully!");
        setEditingStudentId(null);
      } else {
        await api.createStudent({
          admission_number: admissionClean,
          student_name: nameClean,
          date_of_birth: studentForm.date_of_birth,
          class_name: studentForm.class_name,
          academic_year: studentForm.academic_year,
          joining_date: studentForm.joining_date,
          parent_id: studentForm.parent_id,
          discount_type: studentForm.discount_value > 0 ? studentForm.discount_type : null,
          discount_value: studentForm.discount_value,
          notes: studentForm.notes.trim(),
          is_active: true
        });
        toast.success("Student onboarded successfully!");
      }
      fetchAllData();
      // Reset form
      setStudentForm({
        admission_number: "",
        student_name: "",
        date_of_birth: "",
        class_name: "Montessori-1",
        academic_year: "2026-2027",
        joining_date: new Date().toISOString().split("T")[0],
        parent_id: "",
        discount_type: "percentage",
        discount_value: 0,
        notes: ""
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to onboard student profile.");
    }
  };

  // Register parent profile action
  const handleRegisterParent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullNameClean = parentForm.full_name.trim();
      const emailClean = parentForm.email.trim();
      const phoneClean = parentForm.phone.replace(/\D/g, "");

      if (!fullNameClean || !emailClean || !phoneClean) {
        toast.error("Full name, email and contact phone are mandatory.");
        return;
      }

      // Name length validation
      if (fullNameClean.length < 3) {
        toast.error("Full name must be at least 3 characters long.");
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailClean)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      // Phone length validation
      if (phoneClean.length !== 10) {
        toast.error("Please enter a valid 10-digit contact phone number.");
        return;
      }

      // Role assignment validation
      if (parentForm.roles.length === 0) {
        toast.error("Please select at least one backend role.");
        return;
      }

      if (editingParentId) {
        await api.updateProfile(editingParentId, {
          full_name: fullNameClean,
          email: emailClean,
          phone: `+91${phoneClean}`,
          roles: parentForm.roles
        });
        toast.success("Parent profile updated successfully!");
        setEditingParentId(null);
      } else {
        toast.loading("Inviting parent and registering securely via backend...", { id: "onboard-parent" });
        await api.inviteProfile({
          full_name: fullNameClean,
          email: emailClean,
          phone: `+91${phoneClean}`,
          roles: parentForm.roles
        });
        toast.success("Parent invited successfully! A verification email has been sent.", { id: "onboard-parent" });
      }
      fetchAllData();
      // Reset
      setParentForm({
        id: "",
        full_name: "",
        email: "",
        phone: "",
        roles: ["parent"]
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to register parent account.", { id: "onboard-parent" });
    }
  };

  // Register admin profile action
  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullNameClean = adminForm.full_name.trim();
      const emailClean = adminForm.email.trim();
      const phoneClean = adminForm.phone.replace(/\D/g, "");

      if (!fullNameClean || !emailClean || !phoneClean) {
        toast.error("Full name, email and contact phone are mandatory.");
        return;
      }

      if (fullNameClean.length < 3) {
        toast.error("Full name must be at least 3 characters long.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailClean)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (phoneClean.length !== 10) {
        toast.error("Please enter a valid 10-digit contact phone number.");
        return;
      }

      if (adminForm.roles.length === 0) {
        toast.error("Please select at least one backend role.");
        return;
      }

      if (editingAdminId) {
        await api.updateProfile(editingAdminId, {
          full_name: fullNameClean,
          email: emailClean,
          phone: `+91${phoneClean}`,
          roles: adminForm.roles
        });
        toast.success("Admin profile updated successfully!");
        setEditingAdminId(null);
      } else {
        toast.loading("Inviting admin and registering securely via backend...", { id: "onboard-admin" });
        await api.inviteProfile({
          full_name: fullNameClean,
          email: emailClean,
          phone: `+91${phoneClean}`,
          roles: adminForm.roles
        });
        toast.success("Admin invited successfully! A verification email has been sent.", { id: "onboard-admin" });
      }
      fetchAllData();
      // Reset
      setAdminForm({
        id: "",
        full_name: "",
        email: "",
        phone: "",
        roles: ["admin"]
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to register admin account.", { id: "onboard-admin" });
    }
  };

  // Create / Edit fee plan action
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!planForm.class_name || !planForm.program_type || planForm.tuition_fee <= 0) {
        toast.error("ClassName, program identifier and tuition fees are mandatory.");
        return;
      }

      if (editingPlanId) {
        await api.updateFeePlan(editingPlanId, {
          class_name: planForm.class_name,
          program_type: planForm.program_type,
          tuition_fee: planForm.tuition_fee,
          resource_fee: planForm.resource_fee,
          frequency: planForm.frequency,
          description: planForm.description,
          is_active: true
        });
        toast.success("Fee plan configuration updated!");
        setEditingPlanId(null);
      } else {
        await api.createFeePlan({
          class_name: planForm.class_name,
          program_type: planForm.program_type,
          tuition_fee: planForm.tuition_fee,
          resource_fee: planForm.resource_fee,
          frequency: planForm.frequency,
          description: planForm.description,
          is_active: true
        });
        toast.success("Fee configuration plan registered!");
      }
      
      fetchAllData();
      // Reset
      setPlanForm({
        class_name: "",
        program_type: "",
        tuition_fee: 0,
        resource_fee: 0,
        frequency: "quarterly",
        description: ""
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save fee plan.");
    }
  };

  const handleTogglePlanActive = async (id: number) => {
    try {
      await api.toggleFeePlanActive(id);
      toast.success("Fee plan active status updated!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update active status.");
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this fee plan? This cannot be undone.")) {
      return;
    }
    try {
      await api.deleteFeePlan(id);
      toast.success("Fee plan deleted successfully!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete fee plan.");
    }
  };


  // Create fee rule action
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!ruleForm.rule_name || ruleForm.discount_value < 0) {
        toast.error("Rule name and positive discount values are required.");
        return;
      }

      await api.createFeeRule({
        rule_name: ruleForm.rule_name,
        discount_type: ruleForm.discount_type,
        discount_value: ruleForm.discount_value,
        applies_to: ruleForm.applies_to,
        is_active: ruleForm.is_active
      });

      toast.success("Fee discount rule successfully registered!");
      fetchAllData();
      
      // Reset
      setRuleForm({
        rule_name: "",
        discount_type: "fixed",
        discount_value: 0,
        applies_to: "yearly",
        is_active: true
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save fee rule.");
    }
  };

  // Link or update student fee account subscription
  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!accountForm.student_id || !accountForm.fee_plan_id) {
        toast.error("Please select student and fee plan.");
        return;
      }
      if (editingAccountId) {
        await api.updateFeeAccount(editingAccountId, {
          fee_plan_id: Number(accountForm.fee_plan_id),
          payment_cycle: accountForm.payment_cycle,
          effective_from: accountForm.effective_from,
          is_active: true,
          installments: accountForm.payment_cycle === "quarterly" ? accountForm.installments : undefined
        });
        toast.success("Subscription updated successfully!");
        setEditingAccountId(null);
      } else {
        await api.createFeeAccount({
          student_id: Number(accountForm.student_id),
          fee_plan_id: Number(accountForm.fee_plan_id),
          payment_cycle: accountForm.payment_cycle,
          effective_from: accountForm.effective_from,
          is_active: true,
          installments: accountForm.payment_cycle === "quarterly" ? accountForm.installments : 3
        });
        toast.success("Student fee account linked successfully!");
      }
      setAccountForm({ student_id: 0, fee_plan_id: 0, payment_cycle: "quarterly", effective_from: new Date().toISOString().split("T")[0], installments: 3 });
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Linking fee plan failed.");
    }
  };

  // Generate Dues installments
  const handleGenerateDues = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!generateForm.fee_account_id) {
        toast.error("Please select a fee subscription account.");
        return;
      }
      const generated = await api.generateFeeDues({
        fee_account_id: Number(generateForm.fee_account_id),
        period_start: generateForm.period_start,
        starting_installment: Number(generateForm.starting_installment),
        installment_count: Number(generateForm.installment_count),
        first_due_date: generateForm.first_due_date,
        remarks: generateForm.remarks || undefined
      });
      toast.success(`Successfully computed and generated ${generated.length} installment due records!`);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Computing due generation failed.");
    }
  };

  // Delete Fee Due Installment
  const handleDeleteDue = async (dueId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this fee due installment? This action cannot be undone.")) {
      return;
    }
    try {
      await api.deleteFeeDue(dueId);
      toast.success("Fee installment deleted successfully!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete fee installment.");
    }
  };

  // Delete Student Fee Account Subscription
  const handleDeleteSubscription = async (accountId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this student fee subscription? This will automatically delete all associated unpaid dues/installments. This action cannot be undone.")) {
      return;
    }
    try {
      await api.deleteFeeAccount(accountId);
      toast.success("Fee subscription deleted successfully!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete fee subscription.");
    }
  };

  // Record desk collected manual payment
  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!paymentForm.fee_due_id || paymentForm.amount_paid <= 0) {
        toast.error("Please select outstanding due and enter amount paid.");
        return;
      }
      await api.recordManualPayment({
        fee_due_id: Number(paymentForm.fee_due_id),
        amount_paid: Number(paymentForm.amount_paid),
        payment_mode: paymentForm.payment_mode,
        remarks: paymentForm.remarks || undefined
      });
      toast.success("Desk manual payment recorded and settled!");
      fetchAllData();
      // Reset
      setPaymentSelectedStudentId(0);
      setPaymentForm({
        fee_due_id: 0,
        amount_paid: 0,
        payment_mode: "cash",
        remarks: ""
      });
    } catch (err: any) {
      toast.error(err.message || "Manual collection failed.");
    }
  };

  const handleDeactivateStudent = async (id: number) => {
    try {
      await api.deactivateStudent(id);
      toast.success("Student marked as inactive.");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate student.");
    }
  };

  const handleActivateStudent = async (id: number) => {
    try {
      await api.activateStudent(id);
      toast.success("Student re-activated successfully!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to activate student.");
    }
  };

  const handleDeactivateParent = async (id: string) => {
    // Safety check: is there any active student associated with this parent?
    const hasActiveStudent = students.some((s) => s.parent_id === id && s.is_active);
    if (hasActiveStudent) {
      toast.error("Cannot deactivate parent: they have an active student enrolled. Deactivate the student first.");
      return;
    }
    if (!confirm("Are you sure you want to mark this parent as inactive?")) return;
    try {
      await api.deactivateProfile(id);
      toast.success("Parent profile marked as inactive.");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate parent profile.");
    }
  };

  const handleActivateParent = async (id: string) => {
    try {
      await api.activateProfile(id);
      toast.success("Parent profile re-activated!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to re-activate parent profile.");
    }
  };

  const handleDeactivateAdmin = async (id: string) => {
    if (id === user?.id) {
      toast.error("You cannot deactivate your own administrative profile.");
      return;
    }
    if (!confirm("Are you sure you want to mark this admin as inactive?")) return;
    try {
      await api.deactivateProfile(id);
      toast.success("Admin profile marked as inactive.");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate admin profile.");
    }
  };

  const handleActivateAdmin = async (id: string) => {
    try {
      await api.activateProfile(id);
      toast.success("Admin profile re-activated!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to re-activate admin profile.");
    }
  };

  const handleResendSignupMail = async (email: string) => {
    try {
      toast.loading("Sending invitation email again...", { id: "resend-mail" });
      try {
        await api.resendInvite(email);
        toast.success("Verification/invite email resent successfully!", { id: "resend-mail" });
      } catch (inviteErr: any) {
        // Fallback: try resending via forgot password (which will send a password recovery / set password link!)
        console.warn("Resend via signup/invite endpoint failed, trying fallback reset/recovery resend:", inviteErr.message);
        await api.forgotPassword(email);
        toast.success("Password reset/invite link sent successfully as fallback!", { id: "resend-mail" });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send email.", { id: "resend-mail" });
    }
  };

  // Alias kept for backward compat within existing call sites
  const handleDeleteParent = handleDeactivateParent;

  // Reset Password Portal Interface
  if (isResetMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row items-stretch">
        <div className="hidden md:flex md:w-1/2 bg-amber-50 dark:bg-amber-950/20 items-center justify-center p-12 relative overflow-hidden border-r border-border">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="max-w-md text-center space-y-6 z-10">
            <img src={aspenLogo} alt="Aspen Montessori" className="h-32 w-auto mx-auto drop-shadow-xl" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck size={28} className="text-primary" />
              <h2 className="text-3xl font-semibold tracking-tight text-amber-900 dark:text-amber-100">
                Aspen Admin Center
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Consolidated administration panel to pre-register profiles, configure role assignments, manage class fee plans, subscribe student accounts, compute term installments, and log manual payments.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 bg-card">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center md:text-left">
              <Link to="/" className="md:hidden">
                <img src={aspenLogo} alt="Aspen Montessori" className="h-16 w-auto mx-auto mb-6" />
              </Link>
              <h1 className="text-3xl font-semibold mb-2">Reset Password</h1>
              <p className="text-muted-foreground text-sm">Create a new secure password for your admin account</p>
            </div>

            <form className="space-y-5" onSubmit={handleResetPasswordSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                  placeholder="Re-enter new password"
                />
              </div>

              {loginError && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14}/> {loginError}</p>}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
              >
                {resetLoading && <RefreshCw className="animate-spin" size={16} />}
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Login screen if not admin authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row items-stretch">
        <div className="hidden md:flex md:w-1/2 bg-amber-50 dark:bg-amber-950/20 items-center justify-center p-12 relative overflow-hidden border-r border-border">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="max-w-md text-center space-y-6 z-10">
            <img src={aspenLogo} alt="Aspen Montessori" className="h-32 w-auto mx-auto drop-shadow-xl" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck size={28} className="text-primary" />
              <h2 className="text-3xl font-semibold tracking-tight text-amber-900 dark:text-amber-100">
                Aspen Admin Center
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Consolidated administration panel to pre-register profiles, configure role assignments, manage class fee plans, subscribe student accounts, compute term installments, and log manual payments.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 bg-card">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center md:text-left">
              <Link to="/" className="md:hidden">
                <img src={aspenLogo} alt="Aspen Montessori" className="h-16 w-auto mx-auto mb-6" />
              </Link>
              <h1 className="text-3xl font-semibold mb-2">
                {isForgotPassword ? "Reset Admin Password" : "Admin Portal"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isForgotPassword 
                  ? "Get instructions sent to your email to set a new admin password" 
                  : "Sign in with administrator credentials"}
              </p>
            </div>

            {isForgotPassword ? (
              <form className="space-y-5" onSubmit={handleForgotPassword}>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                    placeholder="admin@aspenmontessori.in"
                  />
                </div>

                {loginError && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14}/> {loginError}</p>}
                {forgotSuccess && <p className="text-sm text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle size={14}/> Password reset link sent to your email!</p>}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  {forgotLoading && <RefreshCw className="animate-spin" size={16} />}
                  Send Recovery Link
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setForgotSuccess(false);
                    setLoginError("");
                  }}
                  className="w-full text-center text-sm text-primary hover:underline font-medium pt-2"
                >
                  Back to Sign In
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleAdminLogin}>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email</label>
                  <input
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                    placeholder="admin@aspenmontessori.in"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["@gmail.com", "@outlook.com", "@yahoo.com", "@icloud.com"].map((ext) => (
                      <button
                        key={ext}
                        type="button"
                        onClick={() => {
                          const atIndex = username.indexOf("@");
                          if (atIndex !== -1) {
                            setUsername(username.slice(0, atIndex) + ext);
                          } else {
                            setUsername(username + ext);
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          username.endsWith(ext)
                            ? "bg-primary/10 text-primary border-primary/30 font-medium"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground border-transparent"
                        }`}
                      >
                        {ext}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-muted-foreground">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setForgotSuccess(false);
                        setLoginError("");
                      }}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {loginError && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {loginError}</p>}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loginLoading && <RefreshCw className="animate-spin" size={16} />}
                  Sign In
                </button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { type: "dashboard" as TabType, icon: LayoutDashboard, label: "Overview Metrics" },
    { type: "admins" as TabType, icon: ShieldCheck, label: "Admins Directory" },
    { type: "parents" as TabType, icon: UserCheck, label: "Parents Directory" },
    { type: "students" as TabType, icon: GraduationCap, label: "Students Directory" },
    { type: "plans" as TabType, icon: Settings, label: "Class Fee Plans" },
    { type: "accounts" as TabType, icon: BookOpen, label: "Fee Subscriptions" },
    { type: "dues" as TabType, icon: Calculator, label: "Generate Installments" },
    { type: "payments" as TabType, icon: CreditCard, label: "Record desk payments" },
  ];

  const filteredDues = openDues.filter((due) => {
    const student = students.find((s) => s.id === due.student_id);
    const query = dueSearch.toLowerCase().trim();
    if (!query) return true;
    
    const studentName = student?.student_name || "";
    const admissionNum = student?.admission_number || "";
    const dueTitle = due.due_title || "";
    const dueIdStr = String(due.id);
    const statusStr = due.status || "";
    
    return studentName.toLowerCase().includes(query) ||
      admissionNum.toLowerCase().includes(query) ||
      dueTitle.toLowerCase().includes(query) ||
      dueIdStr.includes(query) ||
      statusStr.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:inset-auto flex flex-col justify-between ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src={aspenLogo} alt="Aspen Montessori" className="h-10 w-auto" />
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <nav className="space-y-1">
            {sidebarLinks.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => {
                  setActiveTab(type);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${activeTab === type
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-border space-y-1">
          {roles.includes("parent") && (
            <Link
              to="/parent"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <Users size={16} /> Parent Portal View
            </Link>
          )}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home size={16} /> Back to Home
          </Link>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate("/admin");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Administrative Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-card/85 backdrop-blur-md border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden md:inline">Logged in: {user?.full_name}</span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              AD
            </div>
          </div>
        </header>

        {/* Content Container tabs wrapper */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <AnimatePresence mode="wait">
            {/* 1. Dashboard metrics Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Overview metrics</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Real-time status summaries and revenue figures</p>
                </div>

                {dataLoading ? (
                  <div className="py-20 text-center bg-card rounded-2xl border border-border">
                    <RefreshCw className="animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Aggregating parameters...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">Total Students</span>
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <GraduationCap size={16} />
                          </div>
                        </div>
                        <p className="text-2xl font-bold">{dashboardMetrics?.total_students?.total || 0}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <TrendingUp size={10} className="text-primary" />
                          <span>+{dashboardMetrics?.total_students?.added_this_month || 0} added this month</span>
                        </p>
                      </div>

                      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">Active Parents</span>
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <UserCheck size={16} />
                          </div>
                        </div>
                        <p className="text-2xl font-bold">{dashboardMetrics?.active_parents?.total || 0}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <TrendingUp size={10} className="text-primary" />
                          <span>+{dashboardMetrics?.active_parents?.added_this_month || 0} added this month</span>
                        </p>
                      </div>

                      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Revenue (Month)</span>
                            <button
                              onClick={() => setShowRevenue(!showRevenue)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
                              title={showRevenue ? "Hide Revenue" : "Show Revenue"}
                              aria-label={showRevenue ? "Hide Revenue" : "Show Revenue"}
                            >
                              {showRevenue ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <DollarSign size={16} />
                          </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">
                          {showRevenue ? (
                            `₹${parseFloat(dashboardMetrics?.revenue?.amount || "0").toLocaleString("en-IN")}`
                          ) : (
                            "••••••"
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <TrendingUp size={10} className="text-primary" />
                          <span>+{dashboardMetrics?.revenue?.percent_change || "0"}% change MoM</span>
                        </p>
                      </div>

                      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">New Admissions</span>
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Plus size={16} />
                          </div>
                        </div>
                        <p className="text-2xl font-bold">{dashboardMetrics?.new_admissions?.total || 0}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Since {dashboardMetrics?.new_admissions?.quarter_start || "current quarter"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                      <h3 className="font-semibold text-foreground mb-4">Admissions and Fees overview</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs md:text-sm">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                              <th className="pb-3">Name</th>
                              <th className="pb-3">Program</th>
                              <th className="pb-3">Academic Year</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Dues state</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.slice(0, 8).map((student) => {
                              const plan = feeAccounts.find(a => a.student_id === student.id);
                              return (
                                <tr key={student.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                                  <td className="py-3 font-semibold text-foreground">{student.student_name} <span className="text-muted-foreground font-mono text-[10px]">({student.admission_number})</span></td>
                                  <td className="py-3 text-muted-foreground">{student.class_name}</td>
                                  <td className="py-3 text-muted-foreground">{student.academic_year}</td>
                                  <td className="py-3">
                                    <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-700">
                                      Active
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${plan ? "bg-amber-500/10 text-amber-700" : "bg-muted text-muted-foreground"
                                      }`}>
                                      {plan ? "Fee plan assigned" : "No active cycle"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* 2. Students Directory Tab */}
            {activeTab === "students" && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Onboard and Manage Students</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Register new students and assign discounts</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Onboard student form */}
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      <UserPlus size={16} className="text-primary" /> {editingStudentId ? "Edit student details" : "Onboard new student"}
                    </h3>
                    <form onSubmit={handleOnboardStudent} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Admission Number</label>
                        <input
                          type="text"
                          required
                          value={studentForm.admission_number}
                          onChange={(e) => setStudentForm({ ...studentForm, admission_number: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          placeholder="e.g. AMH-2026-042"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Student Full Name</label>
                        <input
                          type="text"
                          required
                          value={studentForm.student_name}
                          onChange={(e) => setStudentForm({ ...studentForm, student_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          placeholder="Leo Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Date of birth</label>
                          <input
                            type="date"
                            required
                            value={studentForm.date_of_birth}
                            onChange={(e) => setStudentForm({ ...studentForm, date_of_birth: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Joining date</label>
                          <input
                            type="date"
                            required
                            value={studentForm.joining_date}
                            onChange={(e) => setStudentForm({ ...studentForm, joining_date: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Class / Program</label>
                        <select
                          required
                          value={studentForm.class_name}
                          onChange={(e) => setStudentForm({ ...studentForm, class_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        >
                          <option value="">Select class</option>
                          <option value="Montessori-1">Montessori-1</option>
                          <option value="Montessori-2">Montessori-2</option>
                          <option value="Montessori-3">Montessori-3</option>
                          <option value="Toddlers">Toddlers</option>
                          <option value="Daycare">Daycare</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Academic Year</label>
                          <input
                            type="text"
                            required
                            value={studentForm.academic_year}
                            onChange={(e) => setStudentForm({ ...studentForm, academic_year: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                            placeholder="2026-2027"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Parent profile (UUID)</label>
                          <select
                            required
                            value={studentForm.parent_id}
                            onChange={(e) => setStudentForm({ ...studentForm, parent_id: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          >
                            <option value="">Select Parent Profile</option>
                             {profiles.filter(p => ((p as any).roles || []).includes("parent")).map(p => (
                               <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                             ))}
                          </select>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-border pt-3 mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Discount Type</label>
                          <select
                            value={studentForm.discount_type || ""}
                            onChange={(e) => setStudentForm({ ...studentForm, discount_type: e.target.value ? e.target.value as any : null })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          >
                            <option value="">None</option>
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Sum (INR)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Discount Value</label>
                          <input
                            type="number"
                            min="0"
                            value={studentForm.discount_value || ""}
                            onChange={(e) => setStudentForm({ ...studentForm, discount_value: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Custom Notes</label>
                        <textarea
                          rows={2}
                          value={studentForm.notes}
                          onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none resize-none"
                          placeholder="e.g. Elder sibling discount applied"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> {editingStudentId ? "Save Changes" : "Onboard Student"}
                        </button>
                        {editingStudentId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStudentId(null);
                              setStudentForm({
                                admission_number: "",
                                student_name: "",
                                date_of_birth: "",
                                class_name: "Montessori-1",
                                academic_year: "2026-2027",
                                joining_date: new Date().toISOString().split("T")[0],
                                parent_id: "",
                                discount_type: "percentage",
                                discount_value: 0,
                                notes: ""
                              });
                            }}
                            className="px-4 py-2.5 rounded-full bg-muted text-muted-foreground font-semibold text-xs hover:bg-muted/80 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                                        {/* Students Directory list */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <GraduationCap size={16} className="text-primary" /> Onboarded student profile entries
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
                          <input
                            type="text"
                            placeholder="Search students..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none w-48 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="hide-inactive-students-checkbox"
                            type="checkbox"
                            checked={hideInactiveStudents}
                            onChange={(e) => setHideInactiveStudents(e.target.checked)}
                            className="rounded border-border bg-muted text-primary focus:ring-ring h-4 w-4 transition-all cursor-pointer"
                          />
                          <label htmlFor="hide-inactive-students-checkbox" className="text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                            Hide inactive
                          </label>
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                          <th className="pb-3">Adm No.</th>
                          <th className="pb-3">Name</th>
                          <th className="pb-3">
                            <select
                              value={classFilter}
                              onChange={(e) => setClassFilter(e.target.value)}
                              className="bg-transparent border-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground focus:ring-0 outline-none cursor-pointer py-0 px-0 -ml-1"
                            >
                              <option value="All" className="bg-card text-foreground">Class (All)</option>
                              {Array.from(new Set(students.map(s => s.class_name).filter(Boolean))).sort().map(c => (
                                <option key={c} value={c} className="bg-card text-foreground">{c}</option>
                              ))}
                            </select>
                          </th>
                          <th className="pb-3">
                            <select
                              value={yearFilter}
                              onChange={(e) => setYearFilter(e.target.value)}
                              className="bg-transparent border-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground focus:ring-0 outline-none cursor-pointer py-0 px-0 -ml-1"
                            >
                              <option value="All" className="bg-card text-foreground">Academic Yr (All)</option>
                              {Array.from(new Set(students.map(s => s.academic_year).filter(Boolean))).sort().map(y => (
                                <option key={y} value={y} className="bg-card text-foreground">{y}</option>
                              ))}
                            </select>
                          </th>
                          <th className="pb-3">Discounts</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.filter((student) => {
                          const matchesActive = !hideInactiveStudents || student.is_active;
                          const matchesClass = classFilter === "All" || student.class_name === classFilter;
                          const matchesYear = yearFilter === "All" || student.academic_year === yearFilter;
                          const query = studentSearch.toLowerCase().trim();
                          const matchesQuery = !query || 
                            student.student_name.toLowerCase().includes(query) || 
                            student.admission_number.toLowerCase().includes(query) ||
                            (student.class_name || "").toLowerCase().includes(query);
                          return matchesActive && matchesClass && matchesYear && matchesQuery;
                        }).map((student) => (
                          <tr
                            key={student.id}
                            onClick={(e) => {
                              if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
                              setSelectedStudentForView(student);
                            }}
                            className={`border-b border-border/50 last:border-0 transition-colors cursor-pointer ${student.is_active ? "hover:bg-muted/10" : "opacity-50 hover:bg-muted/5"}`}
                          >
                            <td className="py-3 font-semibold text-foreground font-mono">{student.admission_number}</td>
                            <td className="py-3 text-foreground">{student.student_name}</td>
                            <td className="py-3 text-muted-foreground">{student.class_name}</td>
                            <td className="py-3 text-muted-foreground">{student.academic_year}</td>
                            <td className="py-3 text-emerald-600 font-medium">
                              {student.discount_value && parseFloat(student.discount_value as string) > 0 ? (
                                <span>{student.discount_value} {student.discount_type === "percentage" ? "%" : "INR"}</span>
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                student.is_active
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {student.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingStudentId(student.id);
                                    setStudentForm({
                                      admission_number: student.admission_number,
                                      student_name: student.student_name,
                                      date_of_birth: student.date_of_birth,
                                      class_name: student.class_name,
                                      academic_year: student.academic_year,
                                      joining_date: student.joining_date,
                                      parent_id: student.parent_id,
                                      discount_type: student.discount_type as any,
                                      discount_value: parseFloat(student.discount_value as string) || 0,
                                      notes: student.notes || ""
                                    });
                                  }}
                                  className="text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary/20 p-1.5 rounded-full transition-all"
                                  title="Edit"
                                >
                                  <Edit size={12} />
                                </button>
                                {student.is_active ? (
                                  <button
                                    onClick={() => handleDeactivateStudent(student.id)}
                                    className="text-rose-500 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-full transition-all"
                                    title="Mark Inactive"
                                  >
                                    <ToggleRight size={12} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateStudent(student.id)}
                                    className="text-emerald-600 hover:text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded-full transition-all"
                                    title="Re-activate"
                                  >
                                    <ToggleLeft size={12} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Parents profile & roles configurator */}
            {activeTab === "parents" && (
              <motion.div
                key="parents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Parents Directory</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Invite, manage and configure parent profiles and their roles</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Register parent form */}
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      <UserCheck size={16} className="text-primary" /> {editingParentId ? "Edit parent details" : "Pre-register parent account"}
                    </h3>
                    <form onSubmit={handleRegisterParent} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Parent Full Name</label>
                        <input
                          type="text"
                          required
                          value={parentForm.full_name}
                          onChange={(e) => setParentForm({ ...parentForm, full_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Parent Email</label>
                        <input
                          type="email"
                          required
                          value={parentForm.email}
                          onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          placeholder="jane.doe@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Contact Phone</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-muted-foreground font-semibold select-none">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={parentForm.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setParentForm({ ...parentForm, phone: val });
                            }}
                            className="w-full pl-11 pr-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none font-mono"
                            placeholder="9876543210"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Backend Role assignment</label>
                        <div className="flex gap-4 pt-1">
                          <label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={parentForm.roles.includes("parent")}
                              onChange={(e) => {
                                const list = [...parentForm.roles];
                                if (e.target.checked) list.push("parent");
                                else list.splice(list.indexOf("parent"), 1);
                                setParentForm({ ...parentForm, roles: list });
                              }}
                              className="rounded bg-muted border-0"
                            />
                            Parent
                          </label>
                          <label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={parentForm.roles.includes("admin")}
                              onChange={(e) => {
                                const list = [...parentForm.roles];
                                if (e.target.checked) list.push("admin");
                                else list.splice(list.indexOf("admin"), 1);
                                setParentForm({ ...parentForm, roles: list });
                              }}
                              className="rounded bg-muted border-0"
                            />
                            Admin
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> {editingParentId ? "Save Changes" : "Pre-register profile"}
                        </button>
                        {editingParentId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingParentId(null);
                              setParentForm({
                                id: "",
                                full_name: "",
                                email: "",
                                phone: "",
                                roles: ["parent"]
                              });
                            }}
                            className="px-4 py-2.5 rounded-full bg-muted text-muted-foreground font-semibold text-xs hover:bg-muted/80 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Parents profile entries */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <UserCheck size={16} className="text-primary" /> Pre-registered parent profiles
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
                          <input
                            type="text"
                            placeholder="Search parents..."
                            value={parentSearch}
                            onChange={(e) => setParentSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none w-48 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="hide-inactive-parents-checkbox"
                            type="checkbox"
                            checked={hideInactiveParents}
                            onChange={(e) => setHideInactiveParents(e.target.checked)}
                            className="rounded border-border bg-muted text-primary focus:ring-ring h-4 w-4 transition-all cursor-pointer"
                          />
                          <label htmlFor="hide-inactive-parents-checkbox" className="text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                            Hide inactive
                          </label>
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                          <th className="pb-3">UUID</th>
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3">Phone</th>
                          <th className="pb-3">Roles</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.filter(p => {
                          const matchesRole = ((p as any).roles || []).includes("parent");
                          const matchesActive = !hideInactiveParents || p.is_active;
                          const query = parentSearch.toLowerCase().trim();
                          const matchesQuery = !query || 
                            p.full_name.toLowerCase().includes(query) || 
                            p.email.toLowerCase().includes(query) || 
                            p.phone.toLowerCase().includes(query) || 
                            p.id.toLowerCase().includes(query);
                          return matchesRole && matchesActive && matchesQuery;
                        }).map((profile) => (
                          <tr
                            key={profile.id}
                            onClick={(e) => {
                              if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
                              setSelectedParentForView(profile);
                            }}
                            className={`border-b border-border/50 last:border-0 transition-colors cursor-pointer ${profile.is_active ? "hover:bg-muted/10" : "opacity-50 hover:bg-muted/5"}`}
                          >
                            <td className="py-3 font-semibold text-foreground font-mono text-[10px]" title={profile.id}>
                              {profile.id.substring(0, 7)}...
                            </td>
                            <td className="py-3 text-foreground">{profile.full_name}</td>
                            <td className="py-3 text-muted-foreground">{profile.email}</td>
                            <td className="py-3 text-muted-foreground">{profile.phone}</td>
                            <td className="py-3">
                              <div className="flex flex-col gap-1 items-start">
                                {(profile as any).roles?.map((r: string) => (
                                  <span key={r} className="px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary rounded-full uppercase">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                profile.is_active
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {profile.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingParentId(profile.id);
                                    setParentForm({
                                      id: profile.id,
                                      full_name: profile.full_name,
                                      email: profile.email,
                                      phone: profile.phone.replace("+91", ""),
                                      roles: (profile as any).roles || ["parent"]
                                    });
                                  }}
                                  className="text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary/20 p-1.5 rounded-full transition-all"
                                  title="Edit"
                                >
                                  <Edit size={12} />
                                </button>
                                {profile.is_active && (
                                  <button
                                    onClick={() => handleResendSignupMail(profile.email)}
                                    className="text-amber-500 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 p-1.5 rounded-full transition-all"
                                    title="Resend Invite/Signup Link"
                                  >
                                    <Mail size={12} />
                                  </button>
                                )}
                                {profile.is_active ? (
                                  <button
                                    onClick={() => handleDeactivateParent(profile.id)}
                                    className="text-rose-500 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-full transition-all"
                                    title="Mark Inactive"
                                  >
                                    <ToggleRight size={12} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateParent(profile.id)}
                                    className="text-emerald-600 hover:text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded-full transition-all"
                                    title="Re-activate"
                                  >
                                    <ToggleLeft size={12} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3.1. Admins Directory configurator */}
            {activeTab === "admins" && (
              <motion.div
                key="admins"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Admins Directory</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Invite, manage and configure school administrator profiles and roles</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Register admin form */}
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-primary" /> {editingAdminId ? "Edit admin details" : "Pre-register admin account"}
                    </h3>
                    <form onSubmit={handleRegisterAdmin} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Admin Full Name</label>
                        <input
                          type="text"
                          required
                          value={adminForm.full_name}
                          onChange={(e) => setAdminForm({ ...adminForm, full_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          placeholder="Administrator Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Admin Email</label>
                        <input
                          type="email"
                          required
                          value={adminForm.email}
                          onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          placeholder="admin@aspenmontessori.in"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Contact Phone</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-muted-foreground font-semibold select-none">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={adminForm.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setAdminForm({ ...adminForm, phone: val });
                            }}
                            className="w-full pl-11 pr-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none font-mono"
                            placeholder="9876543210"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Backend Role assignment</label>
                        <div className="flex gap-4 pt-1">
                          <label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={adminForm.roles.includes("admin")}
                              onChange={(e) => {
                                const list = [...adminForm.roles];
                                if (e.target.checked) {
                                  if (!list.includes("admin")) list.push("admin");
                                } else {
                                  list.splice(list.indexOf("admin"), 1);
                                }
                                setAdminForm({ ...adminForm, roles: list });
                              }}
                              className="rounded bg-muted border-0"
                            />
                            Admin
                          </label>
                          <label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={adminForm.roles.includes("parent")}
                              onChange={(e) => {
                                const list = [...adminForm.roles];
                                if (e.target.checked) {
                                  if (!list.includes("parent")) list.push("parent");
                                } else {
                                  list.splice(list.indexOf("parent"), 1);
                                }
                                setAdminForm({ ...adminForm, roles: list });
                              }}
                              className="rounded bg-muted border-0"
                            />
                            Parent
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> {editingAdminId ? "Save Changes" : "Pre-register admin"}
                        </button>
                        {editingAdminId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAdminId(null);
                              setAdminForm({
                                id: "",
                                full_name: "",
                                email: "",
                                phone: "",
                                roles: ["admin"]
                              });
                            }}
                            className="px-4 py-2.5 rounded-full bg-muted text-muted-foreground font-semibold text-xs hover:bg-muted/80 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Admins profile entries */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-primary" /> Pre-registered administrative profiles
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
                          <input
                            type="text"
                            placeholder="Search admins..."
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none w-48 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="hide-inactive-admins-checkbox"
                            type="checkbox"
                            checked={hideInactiveAdmins}
                            onChange={(e) => setHideInactiveAdmins(e.target.checked)}
                            className="rounded border-border bg-muted text-primary focus:ring-ring h-4 w-4 transition-all cursor-pointer"
                          />
                          <label htmlFor="hide-inactive-admins-checkbox" className="text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                            Hide inactive
                          </label>
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                          <th className="pb-3">UUID</th>
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3">Phone</th>
                          <th className="pb-3">Roles</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.filter(p => {
                          const matchesRole = ((p as any).roles || []).includes("admin");
                          const matchesActive = !hideInactiveAdmins || p.is_active;
                          const query = adminSearch.toLowerCase().trim();
                          const matchesQuery = !query || 
                            p.full_name.toLowerCase().includes(query) || 
                            p.email.toLowerCase().includes(query) || 
                            p.phone.toLowerCase().includes(query) || 
                            p.id.toLowerCase().includes(query);
                          return matchesRole && matchesActive && matchesQuery;
                        }).map((profile) => (
                          <tr key={profile.id} className={`border-b border-border/50 last:border-0 transition-colors ${profile.is_active ? "hover:bg-muted/10" : "opacity-50 hover:bg-muted/5"}`}>
                            <td className="py-3 font-semibold text-foreground font-mono text-[10px]" title={profile.id}>
                              {profile.id.substring(0, 7)}...
                            </td>
                            <td className="py-3 text-foreground">{profile.full_name}</td>
                            <td className="py-3 text-muted-foreground">{profile.email}</td>
                            <td className="py-3 text-muted-foreground">{profile.phone}</td>
                            <td className="py-3">
                              <div className="flex flex-col gap-1 items-start">
                                {(profile as any).roles?.map((r: string) => (
                                  <span key={r} className="px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary rounded-full uppercase">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${profile.is_active
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                }`}>
                                {profile.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingAdminId(profile.id);
                                    setAdminForm({
                                      id: profile.id,
                                      full_name: profile.full_name,
                                      email: profile.email,
                                      phone: profile.phone.replace("+91", ""),
                                      roles: (profile as any).roles || ["admin"]
                                    });
                                  }}
                                  className="text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary/20 p-1.5 rounded-full transition-all"
                                  title="Edit"
                                >
                                  <Edit size={12} />
                                </button>
                                {profile.is_active && (
                                  <button
                                    onClick={() => handleResendSignupMail(profile.email)}
                                    className="text-amber-500 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 p-1.5 rounded-full transition-all"
                                    title="Resend Invite/Signup Link"
                                  >
                                    <Mail size={12} />
                                  </button>
                                )}
                                {profile.is_active ? (
                                  <button
                                    onClick={() => handleDeactivateAdmin(profile.id)}
                                    className="text-rose-500 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-full transition-all"
                                    title="Mark Inactive"
                                  >
                                    <ToggleRight size={12} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateAdmin(profile.id)}
                                    className="text-emerald-600 hover:text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded-full transition-all"
                                    title="Re-activate"
                                  >
                                    <ToggleLeft size={12} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Class Fee Plans Tab */}
            {activeTab === "plans" && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Class Program Fee Plans</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Register new pricing tiers for Montessori and daycare grades</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Create fee plan form */}
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      {editingPlanId ? <Edit size={16} className="text-primary" /> : <Plus size={16} className="text-primary" />} 
                      {editingPlanId ? "Edit program fee plan" : "Configure program fee plan"}
                    </h3>
                    <form onSubmit={handleCreatePlan} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Class / Program</label>
                        <select
                          required
                          disabled={!!editingPlanId}
                          value={planForm.class_name}
                          onChange={(e) => {
                            const cls = e.target.value;
                           const slugMap: Record<string, string> = {
                              "Montessori-1": "mont1",
                              "Montessori-2": "mont2",
                              "Montessori-3": "mont3",
                              "Toddlers": "toddler",
                              "Daycare": "daycare",
                            };
                            // Auto-set frequency: Daycare → monthly, Montessori → yearly default
                            const defaultFreq = cls === "Daycare" ? "monthly" : "yearly";
                            setPlanForm({ ...planForm, class_name: cls, program_type: slugMap[cls] || "", frequency: defaultFreq as any });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="">Select class</option>
                          <option value="Montessori-1">Montessori-1</option>
                          <option value="Montessori-2">Montessori-2</option>
                          <option value="Montessori-3">Montessori-3</option>
                          <option value="Toddlers">Toddlers</option>
                          <option value="Daycare">Daycare</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Program Type Identifier</label>
                        <input
                          type="text"
                          readOnly
                          value={planForm.program_type}
                          className="w-full px-3 py-2 rounded-xl bg-muted/50 border-0 text-xs outline-none text-muted-foreground cursor-not-allowed"
                          placeholder="Auto-filled from class"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Tuition Fee (₹)</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={planForm.tuition_fee || ""}
                            onChange={(e) => setPlanForm({ ...planForm, tuition_fee: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Resource Fee (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={planForm.resource_fee || ""}
                            onChange={(e) => setPlanForm({ ...planForm, resource_fee: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Frequency Cycle</label>
                        <select
                          disabled={!!editingPlanId}
                          value={planForm.frequency}
                          onChange={(e) => setPlanForm({ ...planForm, frequency: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="monthly">Monthly (Daycare only)</option>
                          <option value="quarterly">Quarterly (Montessori only)</option>
                          <option value="yearly">Yearly (Montessori only)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Plan Description</label>
                        <textarea
                          rows={2}
                          disabled={!!editingPlanId}
                          value={planForm.description}
                          onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                          placeholder="Standard Montessori plan details..."
                        />
                      </div>

                      <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-[10px] text-muted-foreground space-y-1">
                        <p className="font-semibold text-primary">Frequency Constraints Reminder:</p>
                        <p>• Daycare cycles MUST be monthly</p>
                        <p>• Montessori plans MUST be quarterly or yearly</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          {editingPlanId ? <Save size={14} /> : <Plus size={14} />} 
                          {editingPlanId ? "Save Changes" : "Register Fee Plan"}
                        </button>
                        {editingPlanId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPlanId(null);
                              setPlanForm({
                                class_name: "",
                                program_type: "",
                                tuition_fee: 0,
                                resource_fee: 0,
                                frequency: "quarterly",
                                description: ""
                              });
                            }}
                            className="px-4 py-2.5 rounded-full bg-muted text-muted-foreground font-semibold text-xs hover:bg-muted/80 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Fee plan list */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <Settings size={16} className="text-primary" /> Configured program fee plans
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
                          <input
                            type="text"
                            placeholder="Search fee plans..."
                            value={planSearch}
                            onChange={(e) => setPlanSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none w-48 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="hide-inactive-plans-checkbox"
                            type="checkbox"
                            checked={hideInactivePlans}
                            onChange={(e) => setHideInactivePlans(e.target.checked)}
                            className="rounded border-border bg-muted text-primary focus:ring-ring h-4 w-4 transition-all cursor-pointer"
                          />
                          <label htmlFor="hide-inactive-plans-checkbox" className="text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                            Hide inactive
                          </label>
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                          <th className="pb-3">Class</th>
                          <th className="pb-3">Prog. Type</th>
                          <th className="pb-3">Tuition Fee</th>
                          <th className="pb-3">Resource Fee</th>
                          <th className="pb-3">Frequency</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feePlans.filter((plan) => {
                          const matchesActive = !hideInactivePlans || plan.is_active;
                          const query = planSearch.toLowerCase().trim();
                          const matchesQuery = !query || 
                            plan.class_name.toLowerCase().includes(query) || 
                            plan.program_type.toLowerCase().includes(query) ||
                            plan.frequency.toLowerCase().includes(query);
                          return matchesActive && matchesQuery;
                        }).map((plan) => (
                          <tr key={plan.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
                            <td className="py-3 font-semibold text-foreground">{plan.class_name}</td>
                            <td className="py-3 text-muted-foreground font-mono">{plan.program_type}</td>
                            <td className="py-3 text-foreground font-medium">₹{parseFloat(plan.tuition_fee).toLocaleString()}</td>
                            <td className="py-3 text-foreground font-medium">₹{parseFloat(plan.resource_fee).toLocaleString()}</td>
                            <td className="py-3 font-semibold capitalize text-primary">{plan.frequency}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                plan.is_active
                                  ? "bg-emerald-500/10 text-emerald-700"
                                  : "bg-rose-500/10 text-rose-700"
                              }`}>
                                {plan.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingPlanId(plan.id);
                                    setPlanForm({
                                      class_name: plan.class_name,
                                      program_type: plan.program_type,
                                      tuition_fee: parseFloat(plan.tuition_fee) || 0,
                                      resource_fee: parseFloat(plan.resource_fee) || 0,
                                      frequency: plan.frequency as any,
                                      description: plan.description || ""
                                    });
                                  }}
                                  className="text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary/20 p-1.5 rounded-full transition-all"
                                  title="Edit"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleTogglePlanActive(plan.id)}
                                  className={`p-1.5 rounded-full transition-all ${
                                    plan.is_active
                                      ? "text-rose-500 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20"
                                      : "text-emerald-600 hover:text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20"
                                  }`}
                                  title={plan.is_active ? "Deactivate Plan" : "Activate Plan"}
                                >
                                  {plan.is_active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                </button>
                                <button
                                  onClick={() => handleDeletePlan(plan.id)}
                                  className="text-rose-500 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-full transition-all"
                                  title="Delete Plan"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Active Fee Discount Rules Section */}
                <div className="border-t border-border pt-8 mt-6">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                      <Tag size={20} className="text-primary" /> Active Fee Discount Rules
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Configure and review institutional discounts, including full-year advance payments and multi-child deductions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    {/* Create Fee Rule Form */}
                    <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <Plus size={16} className="text-primary" /> Create discount rule
                      </h3>
                      <form onSubmit={handleCreateRule} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Rule Name</label>
                          <input
                            type="text"
                            required
                            value={ruleForm.rule_name}
                            onChange={(e) => setRuleForm({ ...ruleForm, rule_name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                            placeholder="e.g. sibling_discount, full_year_discount"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Discount Type</label>
                            <select
                              value={ruleForm.discount_type}
                              onChange={(e) => setRuleForm({ ...ruleForm, discount_type: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                            >
                              <option value="fixed">Fixed (₹)</option>
                              <option value="percentage">Percentage (%)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Value</label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={ruleForm.discount_value || ""}
                              onChange={(e) => setRuleForm({ ...ruleForm, discount_value: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Applies to cycle</label>
                          <select
                            value={ruleForm.applies_to}
                            onChange={(e) => setRuleForm({ ...ruleForm, applies_to: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          >
                            <option value="yearly">Yearly installments</option>
                            <option value="quarterly">Quarterly installments</option>
                            <option value="monthly">Monthly installments</option>
                            <option value="all">All cycles</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="rule-active"
                            checked={ruleForm.is_active}
                            onChange={(e) => setRuleForm({ ...ruleForm, is_active: e.target.checked })}
                            className="rounded border-gray-300 text-primary focus:ring-ring h-3.5 w-3.5"
                          />
                          <label htmlFor="rule-active" className="text-xs font-semibold text-muted-foreground cursor-pointer">
                            Mark rule as active
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
                        >
                          <Plus size={14} /> Create Rule
                        </button>
                      </form>
                    </div>

                    {/* Fee Rules List */}
                    <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                          <Settings size={16} className="text-primary" /> Active discount rules registry
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
                            <input
                              type="text"
                              placeholder="Search rules..."
                              value={ruleSearch}
                              onChange={(e) => setRuleSearch(e.target.value)}
                              className="pl-8 pr-3 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none w-48 transition-all"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              id="hide-inactive-rules-checkbox"
                              type="checkbox"
                              checked={hideInactiveRules}
                              onChange={(e) => setHideInactiveRules(e.target.checked)}
                              className="rounded border-border bg-muted text-primary focus:ring-ring h-4 w-4 transition-all cursor-pointer"
                            />
                            <label htmlFor="hide-inactive-rules-checkbox" className="text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                              Hide inactive
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {(() => {
                        const filteredRules = feeRules.filter((rule) => {
                          const matchesActive = !hideInactiveRules || rule.is_active;
                          const query = ruleSearch.toLowerCase().trim();
                          const matchesQuery = !query || 
                            rule.rule_name.toLowerCase().includes(query) || 
                            rule.discount_type.toLowerCase().includes(query) || 
                            (rule.applies_to || "").toLowerCase().includes(query);
                          return matchesActive && matchesQuery;
                        });

                        return filteredRules.length === 0 ? (
                          <div className="py-12 text-center border border-dashed border-border rounded-xl">
                            <Tag className="mx-auto text-muted-foreground mb-2 opacity-60" size={24} />
                            <p className="text-xs text-muted-foreground">No custom fee rules match your criteria.</p>
                          </div>
                        ) : (
                          <table className="w-full text-xs md:text-sm">
                            <thead>
                              <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                                <th className="pb-3">Rule Name</th>
                                <th className="pb-3">Type</th>
                                <th className="pb-3">Value</th>
                                <th className="pb-3">Applies To</th>
                                <th className="pb-3">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredRules.map((rule) => (
                                <tr key={rule.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
                                  <td className="py-3 font-semibold text-foreground font-mono">{rule.rule_name}</td>
                                  <td className="py-3 capitalize text-muted-foreground">{rule.discount_type}</td>
                                  <td className="py-3 text-foreground font-medium">
                                    {rule.discount_type === "fixed" ? `₹${parseFloat(rule.discount_value).toLocaleString()}` : `${rule.discount_value}%`}
                                  </td>
                                  <td className="py-3 capitalize font-semibold text-primary">{rule.applies_to || "all"}</td>
                                  <td className="py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${rule.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                                      {rule.is_active ? "Active" : "Inactive"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. Student Fee Accounts subscriptions */}
            {activeTab === "accounts" && (
              <motion.div
                key="accounts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Student Fee Account subscriptions</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Subscribe target students to active pricing fee plans</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Link subscription form */}
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      <BookOpen size={16} className="text-primary" /> {editingAccountId ? "Edit subscription" : "Subscribe student to fee plan"}
                    </h3>
                    <form onSubmit={handleLinkAccount} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Student</label>
                        <select
                          required
                          disabled={!!editingAccountId}
                          value={accountForm.student_id}
                          onChange={(e) => {
                            const studId = Number(e.target.value);
                            setAccountForm({ 
                              ...accountForm, 
                              student_id: studId,
                              fee_plan_id: 0, // Reset selected plan to prevent mismatch
                              payment_cycle: "quarterly" // Default cycle reset
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none ${editingAccountId ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          <option value="0">Select Student</option>
                          {students.filter(s => s.is_active !== false).map(s => (
                            <option key={s.id} value={s.id}>{s.student_name} [{s.admission_number}] (Class: {s.class_name})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Fee Plan</label>
                        <select
                          required
                          value={accountForm.fee_plan_id}
                          onChange={(e) => {
                            const planId = Number(e.target.value);
                            const selectedPlan = feePlans.find(p => p.id === planId);
                            setAccountForm({
                              ...accountForm,
                              fee_plan_id: planId,
                              // Auto-sync payment cycle to the plan's frequency
                              payment_cycle: (selectedPlan?.frequency ?? accountForm.payment_cycle) as any,
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        >
                          <option value="0">Select Fee Plan</option>
                          {(() => {
                            const selectedSubStudent = students.find(s => s.id === Number(accountForm.student_id));
                            const isToddler = (selectedSubStudent?.class_name || "").toLowerCase() === "toddlers";
                            const filteredPlans = selectedSubStudent
                              ? feePlans.filter(p => 
                                  (p.class_name || "").toLowerCase() === (selectedSubStudent.class_name || "").toLowerCase() ||
                                  (p.program_type === "daycare" && !isToddler)
                                )
                              : feePlans;
                            
                            return filteredPlans.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.class_name} - Tuition: ₹{parseFloat(p.tuition_fee).toLocaleString()} ({p.frequency})
                              </option>
                            ));
                          })()}
                        </select>
                        {(() => {
                          const selectedSubStudent = students.find(s => s.id === Number(accountForm.student_id));
                          const isToddler = (selectedSubStudent?.class_name || "").toLowerCase() === "toddlers";
                          const filteredPlans = selectedSubStudent
                            ? feePlans.filter(p => 
                                (p.class_name || "").toLowerCase() === (selectedSubStudent.class_name || "").toLowerCase() ||
                                (p.program_type === "daycare" && !isToddler)
                              )
                            : feePlans;
                          
                          if (selectedSubStudent && filteredPlans.length === 0) {
                            return (
                              <p className="text-[10px] text-destructive mt-1 font-semibold">
                                ⚠️ No fee plans found for class "{selectedSubStudent.class_name}". Please create one under "Class Fee Plans" first.
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Payment Cycle</label>
                        {accountForm.fee_plan_id ? (
                          <div className="w-full px-3 py-2 rounded-xl bg-muted/50 border-0 text-xs text-muted-foreground flex items-center gap-2 cursor-not-allowed">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase text-[10px] tracking-wider">
                              {accountForm.payment_cycle}
                            </span>
                            <span className="text-[10px]">Auto-set from plan — cannot be changed independently</span>
                          </div>
                        ) : (
                          <div className="w-full px-3 py-2 rounded-xl bg-muted/30 border-0 text-xs text-muted-foreground/50 italic">
                            Select a fee plan first
                          </div>
                        )}
                      </div>
                      {accountForm.payment_cycle === "quarterly" && (
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Installments (Quarterly Plan)</label>
                          <select
                            value={accountForm.installments}
                            onChange={(e) => setAccountForm({ ...accountForm, installments: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none text-foreground font-semibold"
                          >
                            <option value={3}>3 Installments</option>
                            <option value={4}>4 Installments</option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Effective start date</label>
                        <input
                          type="date"
                          required
                          value={accountForm.effective_from}
                          onChange={(e) => setAccountForm({ ...accountForm, effective_from: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        />
                      </div>

                      <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-[10px] text-muted-foreground space-y-1">
                        <p className="font-semibold text-primary">Validation Rule check:</p>
                        <p>• Student class and plan class MUST be identical.</p>
                        <p>• Linked cycle and plan frequency MUST be identical.</p>
                      </div>

                      {editingAccountId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAccountId(null);
                            setAccountForm({ student_id: 0, fee_plan_id: 0, payment_cycle: "quarterly", effective_from: new Date().toISOString().split("T")[0], installments: 3 });
                          }}
                          className="w-full py-2 rounded-full bg-muted text-muted-foreground font-semibold text-xs hover:bg-muted/80 transition-all flex items-center justify-center gap-1.5 mb-2"
                        >
                          Cancel Editing
                        </button>
                      )}
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        {editingAccountId ? <><Pencil size={14} /> Update Subscription</> : <><Plus size={14} /> Subscribe Account</>}
                      </button>
                    </form>
                  </div>

                  {/* Subscriptions list */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <BookOpen size={16} className="text-primary" /> Active Student fee accounts
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
                          <input
                            type="text"
                            placeholder="Search subscriptions..."
                            value={accountSearch}
                            onChange={(e) => setAccountSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none w-48 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="hide-inactive-accounts-checkbox"
                            type="checkbox"
                            checked={hideInactiveAccounts}
                            onChange={(e) => setHideInactiveAccounts(e.target.checked)}
                            className="rounded border-border bg-muted text-primary focus:ring-ring h-4 w-4 transition-all cursor-pointer"
                          />
                          <label htmlFor="hide-inactive-accounts-checkbox" className="text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                            Hide inactive
                          </label>
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                          <th className="pb-3">ID</th>
                          <th className="pb-3">Student Name</th>
                          <th className="pb-3">Plan Class</th>
                          <th className="pb-3">Effective Date</th>
                          <th className="pb-3">Cycle</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeAccounts.filter((account) => {
                          const studentObj = students.find(s => s.id === account.student_id);
                          const matchesActive = !hideInactiveAccounts || studentObj?.is_active !== false;

                          const query = accountSearch.toLowerCase().trim();
                          const planName = feePlans.find(p => p.id === account.fee_plan_id)?.class_name || "";
                          const matchesQuery = !query || 
                            (studentObj?.student_name || "").toLowerCase().includes(query) || 
                            (studentObj?.admission_number || "").toLowerCase().includes(query) || 
                            planName.toLowerCase().includes(query) || 
                            account.payment_cycle.toLowerCase().includes(query) || 
                            String(account.id).includes(query);

                          return matchesActive && matchesQuery;
                        }).map((account) => {
                          const studentObj = students.find(s => s.id === account.student_id);
                          const studentName = studentObj ? `${studentObj.student_name} [${studentObj.admission_number}]` : "Unknown Student";
                          const planName = feePlans.find(p => p.id === account.fee_plan_id)?.class_name || "Unknown Plan";
                          return (
                            <tr key={account.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors ${editingAccountId === account.id ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}>
                              <td className="py-3 font-semibold text-foreground font-mono">{account.id}</td>
                              <td className="py-3 text-foreground">{studentName}</td>
                              <td className="py-3 text-muted-foreground">{planName}</td>
                              <td className="py-3 text-muted-foreground">{account.effective_from}</td>
                              <td className="py-3 font-semibold capitalize text-primary">
                                 {account.payment_cycle === "quarterly" ? `Quarterly (${account.installments || 3} Inst)` : account.payment_cycle}
                               </td>
                              <td className="py-3 text-right">
                                <div className="flex gap-1 justify-end">
                                  <button
                                    onClick={() => {
                                      setEditingAccountId(account.id);
                                      setAccountForm({
                                        student_id: account.student_id,
                                        fee_plan_id: account.fee_plan_id,
                                        payment_cycle: account.payment_cycle,
                                        effective_from: account.effective_from,
                                        installments: account.installments || 3
                                      });
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                    title="Edit subscription"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubscription(account.id)}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                                    title="Delete subscription"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. Fee dues generator Tab */}
            {activeTab === "dues" && (
              <motion.div
                key="dues"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Generate installment dues</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Compute discounts, resource fees and write open installment dues</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Dues generator form */}
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      <Calculator size={16} className="text-primary" /> Generate fee installments
                    </h3>
                    <form onSubmit={handleGenerateDues} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Student Fee Subscription</label>
                        <select
                          required
                          value={generateForm.fee_account_id}
                          onChange={(e) => {
                            const accId = Number(e.target.value);
                            const selectedAcc = feeAccounts.find(a => a.id === accId);
                            const cycle = selectedAcc?.payment_cycle || "quarterly";
                            const defaultCount = cycle === "yearly" ? 1 : cycle === "quarterly" ? (selectedAcc?.installments ?? 3) : 12;
                            setGenerateForm({ ...generateForm, fee_account_id: accId, starting_installment: 1, installment_count: defaultCount });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        >
                          <option value="0">Select Fee Subscription Account</option>
                          {feeAccounts.filter(a => {
                            const student = students.find(s => s.id === a.student_id);
                            return student && student.is_active !== false && a.is_active !== false;
                          }).map(a => {
                            const sObj = students.find(s => s.id === a.student_id);
                            const name = sObj ? `${sObj.student_name} [${sObj.admission_number}]` : "Student";
                            return (
                              <option key={a.id} value={a.id}>
                                {name} ({a.payment_cycle === "quarterly" ? `Quarterly - ${a.installments || 3} Inst` : a.payment_cycle})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Period Cycle Start Date</label>
                        <input
                          type="date"
                          required
                          value={generateForm.period_start}
                          onChange={(e) => setGenerateForm({ ...generateForm, period_start: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        />
                      </div>
                      {(() => {
                        const selectedAcc = feeAccounts.find(a => a.id === generateForm.fee_account_id);
                        const cycle = selectedAcc?.payment_cycle || "quarterly";
                        const maxInstallments = cycle === "yearly" ? 1 : cycle === "quarterly" ? (selectedAcc?.installments ?? 3) : 12;
                        return (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground mb-1">Starting Installment No.</label>
                              <select
                                required
                                value={generateForm.starting_installment}
                                onChange={(e) => setGenerateForm({ ...generateForm, starting_installment: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                                disabled={cycle === "yearly"}
                              >
                                {Array.from({ length: maxInstallments }, (_, i) => i + 1).map(n => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground mb-1">Count (Installments)</label>
                              <select
                                required
                                value={generateForm.installment_count}
                                onChange={(e) => setGenerateForm({ ...generateForm, installment_count: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                                disabled={cycle === "yearly"}
                              >
                                {cycle === "quarterly" ? (
                                  <>
                                    <option value={3} disabled={maxInstallments !== 3}>3 Installments</option>
                                    <option value={4} disabled={maxInstallments !== 4}>4 Installments</option>
                                  </>
                                ) : cycle === "yearly" ? (
                                  <option value={1}>1 Installment</option>
                                ) : (
                                  Array.from({ length: maxInstallments }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}</option>
                                  ))
                                )}
                              </select>
                            </div>
                          </div>
                        );
                      })()}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">First installment Due date</label>
                        <input
                          type="date"
                          required
                          value={generateForm.first_due_date}
                          onChange={(e) => setGenerateForm({ ...generateForm, first_due_date: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Remarks</label>
                        <textarea
                          rows={2}
                          value={generateForm.remarks}
                          onChange={(e) => setGenerateForm({ ...generateForm, remarks: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none resize-none"
                          placeholder="Academic term installment generation..."
                        />
                      </div>

                      <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-[10px] text-muted-foreground space-y-1">
                        <p className="font-semibold text-emerald-600">Installment logic details:</p>
                        <p>• Yearly Plan: generates 1 annual due installment</p>
                        <p>• Quarterly Plan: 3 or 4 terms. Term 1 charges Tuition + Resource fee. Terms 2–4 exclude resource charges.</p>
                        <p>• Monthly Plan: up to 12 installments per year.</p>
                        <p>• Full year discount applied automatically where applicable</p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Calculator size={14} /> Compute and Generate Dues
                      </button>
                    </form>
                  </div>

                  {/* generated dues list */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <AlertCircle size={16} className="text-primary" /> Outstanding pending/partial dues ledger
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
                        <input
                          type="text"
                          placeholder="Search dues ledger..."
                          value={dueSearch}
                          onChange={(e) => {
                            setDueSearch(e.target.value);
                            setDuesPage(1); // Reset page on search
                          }}
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none w-48 transition-all"
                        />
                      </div>
                    </div>
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-left text-[10px] font-bold uppercase tracking-wider">
                          <th className="pb-3">Title / Period</th>
                          <th className="pb-3">Final Sum</th>
                          <th className="pb-3">Discount</th>
                          <th className="pb-3">Paid</th>
                          <th className="pb-3">Balance</th>
                          <th className="pb-3 text-right">Status</th>
                          <th className="pb-3 text-right pr-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const studentGroups = (() => {
                            const groups: { studentId: number; studentName: string; admissionNumber: string; dues: typeof openDues }[] = [];
                            filteredDues.forEach((due) => {
                              const student = students.find((s) => s.id === due.student_id);
                              const studentId = due.student_id;
                              const studentName = student ? student.student_name : `Student ID: ${due.student_id}`;
                              const admissionNumber = student ? student.admission_number : "N/A";
                              
                              let group = groups.find(g => g.studentId === studentId);
                              if (!group) {
                                group = { studentId, studentName, admissionNumber, dues: [] };
                                groups.push(group);
                              }
                              group.dues.push(due);
                            });
                            return groups;
                          })();

                          const groupsPerPage = 5;
                          const totalDuesPages = Math.ceil(studentGroups.length / groupsPerPage) || 1;
                          const paginatedGroups = studentGroups.slice((duesPage - 1) * groupsPerPage, duesPage * groupsPerPage);

                          if (paginatedGroups.length === 0) {
                            return (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                                  No outstanding dues match your search.
                                </td>
                              </tr>
                            );
                          }

                          return paginatedGroups.map((group) => {
                            const isExpanded = !!expandedStudentIds[group.studentId];
                            return (
                              <React.Fragment key={group.studentId}>
                                {/* Student Section Header Row */}
                                <tr 
                                  className="bg-muted/40 border-b border-border/60 cursor-pointer hover:bg-muted/60 transition-colors"
                                  onClick={() => {
                                    setExpandedStudentIds(prev => ({
                                      ...prev,
                                      [group.studentId]: !prev[group.studentId]
                                    }));
                                  }}
                                >
                                  <td colSpan={7} className="py-2.5 px-3 font-semibold text-primary text-[10px] uppercase tracking-wider text-left select-none">
                                    <div className="flex items-center gap-1.5">
                                      {isExpanded ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />}
                                      <span>👤 {group.studentName}</span>
                                      <span className="text-muted-foreground ml-1 font-mono">({group.admissionNumber})</span>
                                      <span className="text-[9px] lowercase font-normal text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">
                                        {group.dues.length} open due{group.dues.length > 1 ? "s" : ""}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && group.dues.map((due) => (
                                  <tr key={due.id} className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors">
                                    <td className="py-3 pl-6">
                                      <p className="font-semibold text-foreground truncate max-w-[180px]" title={due.due_title}>{due.due_title}</p>
                                      <p className="text-[9px] text-muted-foreground font-mono">Due ID: {due.id}</p>
                                    </td>
                                    <td className="py-3 font-semibold text-foreground">₹{parseFloat(due.final_amount).toLocaleString()}</td>
                                    <td className="py-3 text-emerald-600 font-medium">-₹{parseFloat(due.discount_applied).toLocaleString()}</td>
                                    <td className="py-3 text-muted-foreground">₹{parseFloat(due.paid_amount).toLocaleString()}</td>
                                    <td className="py-3 font-bold text-primary">₹{parseFloat(due.balance).toLocaleString()}</td>
                                    <td className="py-3 text-right pr-3">
                                      <span className="inline-flex px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-700">
                                        {due.status}
                                      </span>
                                    </td>
                                    <td className="py-3 text-right pr-3">
                                      {(due.status === "pending" || due.status === "overdue") ? (
                                        <button
                                          onClick={() => handleDeleteDue(due.id)}
                                          className="p-1 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                          title="Delete fee due installment"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      ) : (
                                        <span className="text-[10px] text-muted-foreground italic">No actions</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          });
                        })()}
                      </tbody>
                    </table>

                    {(() => {
                      const studentGroups = (() => {
                        const groups: { studentId: number; studentName: string; admissionNumber: string; dues: typeof openDues }[] = [];
                        filteredDues.forEach((due) => {
                          const student = students.find((s) => s.id === due.student_id);
                          const studentId = due.student_id;
                          const studentName = student ? student.student_name : `Student ID: ${due.student_id}`;
                          const admissionNumber = student ? student.admission_number : "N/A";
                          
                          let group = groups.find(g => g.studentId === studentId);
                          if (!group) {
                            group = { studentId, studentName, admissionNumber, dues: [] };
                            groups.push(group);
                          }
                          group.dues.push(due);
                        });
                        return groups;
                      })();

                      const groupsPerPage = 5;
                      const totalDuesPages = Math.ceil(studentGroups.length / groupsPerPage) || 1;
                      if (totalDuesPages <= 1) return null;
                      
                      return (
                        <div className="flex items-center justify-between border-t border-border pt-4 mt-4 text-xs">
                          <span className="text-muted-foreground">
                            Showing student groups {Math.min(studentGroups.length, (duesPage - 1) * groupsPerPage + 1)}-{Math.min(studentGroups.length, duesPage * groupsPerPage)} of {studentGroups.length}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={duesPage === 1}
                              onClick={() => setDuesPage(prev => Math.max(prev - 1, 1))}
                              className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-all font-medium"
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              disabled={duesPage === totalDuesPages}
                              onClick={() => setDuesPage(prev => Math.min(prev + 1, totalDuesPages))}
                              className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-all font-medium"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. Manual payments collector */}
            {activeTab === "payments" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Manual Desk Payments collection</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Log manual cash, UPI, or bank transfers received directly at the desk</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Record payment form */}
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      <Save size={16} className="text-primary" /> Record manual payment receipt
                    </h3>
                    <form onSubmit={handleRecordManualPayment} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Student</label>
                        <select
                          required
                          value={paymentSelectedStudentId}
                          onChange={(e) => {
                            const studentId = Number(e.target.value);
                            setPaymentSelectedStudentId(studentId);
                            setPaymentForm({ ...paymentForm, fee_due_id: 0, amount_paid: 0 });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        >
                          <option value="0">Select Student</option>
                          {students
                            .filter(s => s.is_active !== false && openDues.some(d => d.student_id === s.id))
                            .map(s => (
                              <option key={s.id} value={s.id}>
                                {s.student_name} [{s.admission_number}]
                              </option>
                            ))
                          }
                        </select>
                      </div>

                      {paymentSelectedStudentId > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Open Dues Installment</label>
                          <select
                            required
                            value={paymentForm.fee_due_id}
                            onChange={(e) => {
                              const dueId = Number(e.target.value);
                              setPaymentForm({ ...paymentForm, fee_due_id: dueId });
                              
                              const selectedDue = openDues.find(d => d.id === dueId);
                              if (selectedDue) {
                                setPaymentForm(prev => ({
                                  ...prev,
                                  fee_due_id: dueId,
                                  amount_paid: parseFloat(selectedDue.balance) || 0
                                }));
                              }
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          >
                            <option value="0">Select Open Due Installment</option>
                            {openDues
                              .filter(d => d.student_id === paymentSelectedStudentId)
                              .map(d => (
                                <option key={d.id} value={d.id}>
                                  {d.due_title} (Bal: ₹{parseFloat(d.balance).toLocaleString()})
                                </option>
                              ))
                            }
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Amount Collected (₹)</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={paymentForm.amount_paid || ""}
                          onChange={(e) => setPaymentForm({ ...paymentForm, amount_paid: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Payment Mode</label>
                        <select
                          required
                          value={paymentForm.payment_mode}
                          onChange={(e) => setPaymentForm({ ...paymentForm, payment_mode: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                        >
                          <option value="cash">Cash collected at counter</option>
                          <option value="upi">Direct UPI scanner transfer</option>
                          <option value="bank_transfer">Direct bank IMPS/NEFT transfer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Remarks</label>
                        <textarea
                          rows={3}
                          value={paymentForm.remarks}
                          onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none resize-none"
                          placeholder="Desk payment notes..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Save size={14} /> Save and Reconcile Balance
                      </button>
                    </form>
                  </div>

                  {/* Manual verification rules */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-1.5">
                        <CheckCircle size={16} className="text-primary" /> Counter receipt guidelines
                      </h3>
                      <div className="space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
                        <p>
                          <strong>1. Verify Physical Collections:</strong> Ensure cash counts are validated twice before locking in database record files.
                        </p>
                        <p>
                          <strong>2. Validate Bank References:</strong> When registering bank IMPS/NEFT transfers, input reference dates in the remarks column.
                        </p>
                        <p>
                          <strong>3. Instant Reconciliations:</strong> Recording a desk payment will automatically deduct the paid amount from the student's remaining due balance. If the remaining balance becomes ₹0, the installment status instantly moves to <span className="bg-emerald-500/10 text-emerald-700 px-1.5 py-0.5 rounded font-semibold text-xs font-mono">paid</span>.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-2xl text-xs flex items-center gap-2 mt-8">
                      <Clock size={16} className="text-primary shrink-0" />
                      <span>Ledgers are calculated on an instant, multi-session synchronized thread database.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Student View Modal */}
      <AnimatePresence>
        {selectedStudentForView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative text-foreground"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedStudentForView(null)}
                  className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Banner/Header */}
              <div className="bg-gradient-to-r from-amber-500/10 to-primary/5 p-6 border-b border-border flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedStudentForView.student_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedStudentForView.student_name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-muted text-muted-foreground rounded-full">
                      Adm: {selectedStudentForView.admission_number}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      selectedStudentForView.is_active
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-rose-500/10 text-rose-700"
                    }`}>
                      {selectedStudentForView.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content body */}
              <div className="p-6 space-y-6">
                {/* 1. General Profile Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-primary" /> General Profile details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/30 border border-border/40 p-4 rounded-2xl text-xs md:text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Class/Grade</p>
                      <p className="font-semibold text-foreground">{selectedStudentForView.class_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Academic Year</p>
                      <p className="font-semibold text-foreground">{selectedStudentForView.academic_year || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Date of Birth</p>
                      <p className="font-semibold text-foreground">{selectedStudentForView.date_of_birth || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Joining Date</p>
                      <p className="font-semibold text-foreground">{selectedStudentForView.joining_date || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Student Concessions</p>
                      <p className="font-semibold text-emerald-600">
                        {selectedStudentForView.discount_value && parseFloat(selectedStudentForView.discount_value as string) > 0 ? (
                          `${selectedStudentForView.discount_value} ${selectedStudentForView.discount_type === "percentage" ? "%" : "INR"}`
                        ) : (
                          "None"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Linked Parent Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Users size={14} className="text-primary" /> Associated Parent Profile
                  </h4>
                  {(() => {
                    const parent = profiles.find((p) => p.id === selectedStudentForView.parent_id);
                    if (!parent) {
                      return <p className="text-xs text-muted-foreground italic">No linked parent account found.</p>;
                    }
                    return (
                      <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 text-xs md:text-sm">
                          <p className="font-semibold text-foreground">{parent.full_name}</p>
                          <p className="text-muted-foreground">{parent.email}</p>
                          {parent.phone && <p className="text-muted-foreground">{parent.phone}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedParentForView(parent);
                            setSelectedStudentForView(null);
                          }}
                          className="px-4 py-2 rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-xs transition-all self-start md:self-auto"
                        >
                          View Parent Profile
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. Subscribed Accounts/Plans */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-primary" /> Fee Plan Enrolled Subscription
                  </h4>
                  {(() => {
                    const subs = feeAccounts.filter((a) => a.student_id === selectedStudentForView.id);
                    if (subs.length === 0) {
                      return <p className="text-xs text-muted-foreground italic">No fee plans active or linked to this student.</p>;
                    }
                    return (
                      <div className="space-y-2">
                        {subs.map((sub) => {
                          const plan = feePlans.find((p) => p.id === sub.fee_plan_id);
                          return (
                            <div key={sub.id} className="bg-muted/30 border border-border/40 p-4 rounded-2xl text-xs md:text-sm flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{plan ? plan.class_name : "Fee Plan"} ({sub.payment_cycle})</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Enrolled from: {sub.effective_from}</p>
                              </div>
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                                sub.is_active ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"
                              }`}>
                                {sub.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* 4. Student Notes */}
                {selectedStudentForView.notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Internal Administrator Notes</h4>
                    <div className="bg-amber-500/[0.03] border border-amber-500/15 p-4 rounded-2xl text-xs text-foreground italic leading-relaxed">
                      {selectedStudentForView.notes}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
                <button
                  onClick={() => setSelectedStudentForView(null)}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all"
                >
                  Close Detail Panel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parent View Modal */}
      <AnimatePresence>
        {selectedParentForView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative text-foreground"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedParentForView(null)}
                  className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Banner/Header */}
              <div className="bg-gradient-to-r from-amber-500/10 to-primary/5 p-6 border-b border-border flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedParentForView.full_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedParentForView.full_name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-muted text-muted-foreground rounded-full">
                      ID: {selectedParentForView.id}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      selectedParentForView.is_active
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-rose-500/10 text-rose-700"
                    }`}>
                      {selectedParentForView.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content body */}
              <div className="p-6 space-y-6">
                {/* 1. Parent Contact info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Users size={14} className="text-primary" /> Contact Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 border border-border/40 p-4 rounded-2xl text-xs md:text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Email Address</p>
                      <a href={`mailto:${selectedParentForView.email}`} className="font-semibold text-primary hover:underline block break-all">
                        {selectedParentForView.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Phone Number</p>
                      {selectedParentForView.phone ? (
                        <a href={`tel:${selectedParentForView.phone}`} className="font-semibold text-foreground hover:underline block">
                          {selectedParentForView.phone}
                        </a>
                      ) : (
                        <p className="text-muted-foreground italic">None</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Linked Children */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-primary" /> Linked Student Profiles
                  </h4>
                  {(() => {
                    const kids = students.filter((s) => s.parent_id === selectedParentForView.id);
                    if (kids.length === 0) {
                      return <p className="text-xs text-muted-foreground italic">No student profiles are registered under this parent profile.</p>;
                    }
                    return (
                      <div className="space-y-3">
                        {kids.map((kid) => (
                          <div key={kid.id} className="bg-muted/30 border border-border/40 p-4 rounded-2xl flex items-center justify-between text-xs md:text-sm">
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground">{kid.student_name}</p>
                              <p className="text-[10px] text-muted-foreground">Class: {kid.class_name} | Adm No: {kid.admission_number}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentForView(kid);
                                setSelectedParentForView(null);
                              }}
                              className="px-4 py-2 rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-xs transition-all"
                            >
                              View Student
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* 3. Account Balance Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-primary" /> Aggregated Financial Summary
                  </h4>
                  {(() => {
                    const kidsIds = students.filter((s) => s.parent_id === selectedParentForView.id).map(s => s.id);
                    const parentDues = openDues.filter(d => kidsIds.includes(d.student_id));
                    const totalBalance = parentDues.reduce((sum, d) => sum + parseFloat(d.balance), 0);
                    
                    return (
                      <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl text-xs md:text-sm">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/60">
                          <p className="font-medium text-muted-foreground">Total Open Term Balance:</p>
                          <p className="text-xl font-bold text-primary">₹{totalBalance.toLocaleString("en-IN")}</p>
                        </div>
                        {parentDues.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">No outstanding dues listed for linked student fee accounts.</p>
                        ) : (
                          <div className="space-y-2 mt-2">
                            {parentDues.map(d => {
                              const s = students.find(s => s.id === d.student_id);
                              return (
                                <div key={d.id} className="flex justify-between text-xs text-muted-foreground">
                                  <span>{s?.student_name}: {d.due_title}</span>
                                  <span className="font-semibold text-foreground">₹{parseFloat(d.balance).toLocaleString()}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
                <button
                  onClick={() => setSelectedParentForView(null)}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all"
                >
                  Close Detail Panel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
