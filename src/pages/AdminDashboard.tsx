import React, { useState, useEffect, useMemo } from "react";
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
  Tag,
  PlusCircle,
  ArrowRightLeft
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
  FeeRuleCreate,
  PaymentResponse
} from "@/apis/api-client";
import aspenLogo from "@/assets/aspen-logo.png";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import ComingSoonPage from "@/components/ComingSoonPage";
import { toast } from "sonner";

type TabType = "dashboard" | "admins" | "students" | "parents" | "plans" | "accounts" | "dues" | "payments" | "transitions";

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
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [hideInactiveStudents, setHideInactiveStudents] = useState(true);
  const [hideInactiveParents, setHideInactiveParents] = useState(true);
  const [hideInactiveAdmins, setHideInactiveAdmins] = useState(true);
  const [hideInactivePlans, setHideInactivePlans] = useState(true);
  const [hideInactiveRules, setHideInactiveRules] = useState(true);
  const [hideInactiveAccounts, setHideInactiveAccounts] = useState(true);
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
  const [allDues, setAllDues] = useState<FeeDueResponse[]>([]);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [showRevenue, setShowRevenue] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // View Details Modal States
  const [selectedStudentForView, setSelectedStudentForView] = useState<StudentResponse | null>(null);
  const [selectedParentForView, setSelectedParentForView] = useState<Profile | null>(null);
  const [selectedDueForReceiptDetails, setSelectedDueForReceiptDetails] = useState<FeeDueResponse | null>(null);
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState<PaymentResponse | null>(null);
  const [paymentSearchQuery, setPaymentSearchQuery] = useState("");

  // Form inputs
  // Student form
  const [studentForm, setStudentForm] = useState({
    admission_number: "",
    student_name: "",
    date_of_birth: "",
    class_name: "Montessori-1",
    academic_year: "2026-2027",
    joining_date: new Date().toISOString().split("T")[0],
    parent_id: ""
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
    admission_fee: 0,
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
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [studentSelectSearch, setStudentSelectSearch] = useState("");
  const [studentSelectOpen, setStudentSelectOpen] = useState(false);
  const [subscriptionSelectSearch, setSubscriptionSelectSearch] = useState("");
  const [subscriptionSelectOpen, setSubscriptionSelectOpen] = useState(false);

  // Student Fee Account subscription form
  const [accountForm, setAccountForm] = useState({
    student_id: 0,
    fee_plan_id: 0,
    payment_cycle: "quarterly" as "monthly" | "quarterly" | "yearly",
    effective_from: new Date().toISOString().split("T")[0],
    installments: 3,
    discount_type: "" as "" | "fixed" | "percentage",
    discount_value: 0,
    discount_mode: "divided" as "divided" | "first_term",
    notes: "",
    charge_admission_fee: false
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

  // Custom standalone due form state
  const [customDueForm, setCustomDueForm] = useState({
    fee_account_id: 0,
    due_title: "",
    amount: 0,
    due_date: new Date().toISOString().split("T")[0],
    remarks: ""
  });
  const [isCustomDueModalOpen, setIsCustomDueModalOpen] = useState(false);


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

  // Class Transitions and Graduation state variables
  const [selectedTransitionStudentIds, setSelectedTransitionStudentIds] = useState<number[]>([]);
  const [transitionNewClassName, setTransitionNewClassName] = useState("Montessori-1");
  const [transitionNewAcademicYear, setTransitionNewAcademicYear] = useState("2026-2027");
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [isGraduateModalOpen, setIsGraduateModalOpen] = useState(false);
  const [graduateChecked, setGraduateChecked] = useState(false);
  const [transitionSearchQuery, setTransitionSearchQuery] = useState("");
  const [transitionClassFilter, setTransitionClassFilter] = useState("All");

  const transitionStudentsWithUnpaidDues = useMemo(() => {
    return selectedTransitionStudentIds.map(studentId => {
      const student = students.find(s => s.id === studentId);
      const studentUnpaidDues = openDues.filter(d => d.student_id === studentId);
      const totalBalance = studentUnpaidDues.reduce((sum, d) => sum + parseFloat(d.balance), 0);
      return {
        student,
        unpaidDuesCount: studentUnpaidDues.length,
        totalBalance
      };
    }).filter(item => item.totalBalance > 0);
  }, [selectedTransitionStudentIds, openDues, students]);


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
      setAllDues(duesList);
      setOpenDues(duesList.filter(d => d.status !== "paid"));

      const allPayments = await api.getAdminPayments();
      setPayments(allPayments);
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

      if (editingStudentId) {
        await api.updateStudent(editingStudentId, {
          admission_number: admissionClean,
          student_name: nameClean,
          date_of_birth: studentForm.date_of_birth,
          class_name: studentForm.class_name,
          academic_year: studentForm.academic_year,
          joining_date: studentForm.joining_date,
          parent_id: studentForm.parent_id
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
        parent_id: ""
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
          admission_fee: planForm.admission_fee,
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
          admission_fee: planForm.admission_fee,
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
        admission_fee: 0,
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


  // Create or update fee rule action
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!ruleForm.rule_name || ruleForm.discount_value < 0) {
        toast.error("Rule name and positive discount values are required.");
        return;
      }

      if (editingRuleId !== null) {
        await api.updateFeeRule(editingRuleId, {
          rule_name: ruleForm.rule_name,
          discount_type: ruleForm.discount_type,
          discount_value: ruleForm.discount_value,
          applies_to: ruleForm.applies_to,
          is_active: ruleForm.is_active
        });
        toast.success("Fee discount rule successfully updated!");
      } else {
        await api.createFeeRule({
          rule_name: ruleForm.rule_name,
          discount_type: ruleForm.discount_type,
          discount_value: ruleForm.discount_value,
          applies_to: ruleForm.applies_to,
          is_active: ruleForm.is_active
        });
        toast.success("Fee discount rule successfully registered!");
      }

      fetchAllData();

      // Reset
      setEditingRuleId(null);
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

  const handleToggleRuleActive = async (ruleId: number) => {
    try {
      await api.toggleFeeRuleActive(ruleId);
      toast.success("Fee rule status toggled successfully!");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle fee rule status.");
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
          installments: accountForm.payment_cycle === "quarterly" ? accountForm.installments : undefined,
          discount_type: accountForm.discount_type || null,
          discount_value: accountForm.discount_type ? Number(accountForm.discount_value) : 0,
          discount_mode: accountForm.discount_type === "fixed" ? accountForm.discount_mode : null,
          notes: accountForm.notes || null,
          charge_admission_fee: accountForm.charge_admission_fee
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
          installments: accountForm.payment_cycle === "quarterly" ? accountForm.installments : 3,
          discount_type: accountForm.discount_type || null,
          discount_value: accountForm.discount_type ? Number(accountForm.discount_value) : 0,
          discount_mode: accountForm.discount_type === "fixed" ? accountForm.discount_mode : null,
          notes: accountForm.notes || null,
          charge_admission_fee: accountForm.charge_admission_fee
        });
        toast.success("Student fee account linked successfully!");
      }
      setAccountForm({
        student_id: 0,
        fee_plan_id: 0,
        payment_cycle: "quarterly",
        effective_from: new Date().toISOString().split("T")[0],
        installments: 3,
        discount_type: "",
        discount_value: 0,
        discount_mode: "divided",
        notes: "",
        charge_admission_fee: false
      });
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
      const selectedAcc = feeAccounts.find(a => a.id === Number(generateForm.fee_account_id));
      const cycle = selectedAcc?.payment_cycle || "quarterly";
      const maxInstallments = cycle === "yearly" ? 1 : cycle === "quarterly" ? (selectedAcc?.installments ?? 3) : 12;

      const generated = await api.generateFeeDues({
        fee_account_id: Number(generateForm.fee_account_id),
        period_start: generateForm.period_start,
        starting_installment: 1,
        installment_count: maxInstallments,
        first_due_date: generateForm.first_due_date,
        remarks: generateForm.remarks || undefined
      });
      toast.success(`Successfully computed and generated ${generated.length} installment due records!`);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Computing due generation failed.");
    }
  };

  // Create Custom Standalone Due
  const handleCreateCustomDue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!customDueForm.fee_account_id) {
        toast.error("Please select a fee subscription account.");
        return;
      }
      if (!customDueForm.due_title.trim()) {
        toast.error("Please enter a due title.");
        return;
      }
      if (customDueForm.amount <= 0) {
        toast.error("Amount must be greater than zero.");
        return;
      }
      await api.createCustomDue({
        fee_account_id: Number(customDueForm.fee_account_id),
        due_title: customDueForm.due_title.trim(),
        amount: Number(customDueForm.amount),
        due_date: customDueForm.due_date,
        remarks: customDueForm.remarks.trim() || undefined
      });
      toast.success("Custom charge installment added successfully!");
      setIsCustomDueModalOpen(false);
      setCustomDueForm({
        fee_account_id: 0,
        due_title: "",
        amount: 0,
        due_date: new Date().toISOString().split("T")[0],
        remarks: ""
      });
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add custom charge.");
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

  // Toggle Student Fee Account Subscription Active/Inactive Status
  const handleToggleSubscriptionActive = async (account: FeeAccountResponse) => {
    const actionText = account.is_active ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${actionText} this student fee subscription?`)) {
      return;
    }
    try {
      await api.updateFeeAccount(account.id, {
        fee_plan_id: account.fee_plan_id,
        payment_cycle: account.payment_cycle,
        effective_from: account.effective_from,
        is_active: !account.is_active,
        installments: account.installments
      });
      toast.success(`Fee subscription ${account.is_active ? "deactivated" : "activated"} successfully!`);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${actionText} fee subscription.`);
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

  const handlePrintReceipt = (payment: PaymentResponse) => {
    const student = students.find((s) => s.id === payment.student_id);
    const studentName = student ? student.student_name : "Student";
    const parent = profiles.find((p) => p.id === student?.parent_id);

    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) return;

    const baseAmount = parseFloat(payment.amount_paid);
    const gatewayCharges = parseFloat(payment.gateway_charges || "0.00");
    const gatewayChargesGst = parseFloat(payment.gateway_charges_gst || "0.00");
    const totalPaid = parseFloat(payment.total_amount_paid || payment.amount_paid);

    const hasCharges = gatewayCharges > 0;
    const due = allDues.find(d => d.id === payment.fee_due_id);
    const billedAmount = due ? parseFloat(due.final_amount) : 0;
    const balance = due ? parseFloat(due.balance) : 0;
    const otherPaid = Math.max(0, billedAmount - baseAmount - balance);

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${payment.id} - Aspen Montessori House</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .header { border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: bold; color: #b45309; }
            .badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: #dcfce7; color: #15803d; text-transform: uppercase; }
            .section { margin-bottom: 24px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .box { padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; font-weight: 600; color: #64748b; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 30px; color: #b45309; }
            .footer { border-top: 1px solid #f1f5f9; margin-top: 60px; padding-top: 20px; font-size: 12px; text-align: center; color: #94a3b8; }
            .breakdown-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">ASPEN MONTESSORI HOUSE</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Receipt of Professional Payments</div>
            </div>
            <div class="badge">Success</div>
          </div>
          <div class="grid">
            <div class="box">
              <strong style="display:block; margin-bottom:8px; color:#475569;">Payer Info</strong>
              <strong>Parent Name:</strong> ${parent ? parent.full_name : "N/A"}<br/>
              <strong>Email:</strong> ${parent ? parent.email : "N/A"}<br/>
              <strong>Phone:</strong> ${parent ? parent.phone : "N/A"}
            </div>
            <div class="box">
              <strong style="display:block; margin-bottom:8px; color:#475569;">Transaction Details</strong>
              <strong>Receipt No:</strong> AMH-REC-${payment.id}<br/>
              <strong>Payment ID:</strong> ${payment.gateway_payment_id || "Desk manual"}<br/>
              <strong>Date:</strong> ${new Date(payment.paid_at || payment.created_at).toLocaleString()}<br/>
              <strong>Payment Mode:</strong> ${payment.payment_mode.replace("_", " ")}
            </div>
          </div>
          <div class="section">
            <strong>Student Account:</strong> ${studentName}

            ${due ? `
            <div style="margin-top: 16px; margin-bottom: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <strong style="color: #1e293b; display: block; margin-bottom: 8px; font-size: 14px;">Billed Installment Breakdown:</strong>
              <div class="breakdown-row">
                <span>Tuition Fee Component:</span>
                <span style="font-weight: 500;">₹${parseFloat(due.tuition_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              ${parseFloat(due.resource_fee) > 0 ? `
              <div class="breakdown-row">
                <span>Resource Fee Component:</span>
                <span style="font-weight: 500;">₹${parseFloat(due.resource_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              ` : ""}
              ${parseFloat(due.admission_fee) > 0 ? `
              <div class="breakdown-row">
                <span>Admission Fee Component:</span>
                <span style="font-weight: 500;">₹${parseFloat(due.admission_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              ` : ""}
              ${parseFloat(due.discount_applied) > 0 ? `
              <div class="breakdown-row" style="color: #15803d; font-weight: 500;">
                <span>Discount Applied Component:</span>
                <span>-₹${parseFloat(due.discount_applied).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              ` : ""}
              <div class="breakdown-row" style="font-weight: bold; border-top: 1px dashed #cbd5e1; padding-top: 8px; margin-top: 8px; color: #1e293b; font-size: 14px;">
                <span>Net Installment Amount Billed:</span>
                <span>₹${parseFloat(due.final_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              ${otherPaid > 0 ? `
              <div class="breakdown-row" style="color: #475569; margin-top: 6px;">
                <span>Previously Settled / Paid at Desk:</span>
                <span style="font-weight: 500;">₹${otherPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              ` : ""}
              ${balance > 0 ? `
              <div class="breakdown-row" style="color: #b45309; margin-top: 4px;">
                <span>Remaining Installment Balance:</span>
                <span style="font-weight: 500;">₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              ` : `
              <div class="breakdown-row" style="color: #15803d; font-weight: 600; margin-top: 4px;">
                <span>Installment Status:</span>
                <span>Fully Paid / Settled</span>
              </div>
              `}
            </div>
            ` : ""}

            <strong style="display: block; margin-top: 20px; font-size: 14px; color: #1e293b;">Transaction Payment Allocation:</strong>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Montessori Fee Installment Clearance (This Payment)</td>
                  <td style="text-align: right; font-weight: 600;">₹${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
                ${hasCharges ? `
                <tr>
                  <td>Online Gateway Convenience Charge (2%)</td>
                  <td style="text-align: right; font-weight: 600;">₹${gatewayCharges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>GST on Gateway Charge (18%)</td>
                  <td style="text-align: right; font-weight: 600;">₹${gatewayChargesGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
                ` : ""}
              </tbody>
            </table>
            <div class="total">Total Received in Transaction: ₹${totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="footer">
            Aspen Montessori House &copy; 2026. Lanco Hills Private Rd, Manikonda, Hyderabad.<br/>
            This is a computer generated confirmation receipt and requires no physical signature.
          </div>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  // Student transitions & bulk promote handlers
  const handleBulkTransition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTransitionStudentIds.length === 0) {
      toast.error("Please select at least one student to transition.");
      return;
    }
    try {
      await api.bulkTransitionStudents({
        student_ids: selectedTransitionStudentIds,
        new_class_name: transitionNewClassName,
        new_academic_year: transitionNewAcademicYear
      });
      toast.success(`Successfully transitioned ${selectedTransitionStudentIds.length} students!`);
      setSelectedTransitionStudentIds([]);
      setIsTransitionModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to transition students.");
    }
  };

  const handleBulkGraduate = async () => {
    if (selectedTransitionStudentIds.length === 0) {
      toast.error("Please select at least one student to graduate.");
      return;
    }
    if (!graduateChecked) {
      toast.error("Please confirm you understand the action by checking the box.");
      return;
    }
    try {
      await api.bulkGraduateStudents({
        student_ids: selectedTransitionStudentIds
      });
      toast.success(`Successfully graduated ${selectedTransitionStudentIds.length} students!`);
      setSelectedTransitionStudentIds([]);
      setIsGraduateModalOpen(false);
      setGraduateChecked(false);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to graduate students.");
    }
  };

  // Computed values for transitions tab filtering and bulk selection
  const transitionFilteredStudents = students.filter((s) => {
    const matchQuery =
      !transitionSearchQuery ||
      s.student_name.toLowerCase().includes(transitionSearchQuery.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(transitionSearchQuery.toLowerCase());
    const matchClass =
      transitionClassFilter === "All" ||
      s.class_name === transitionClassFilter;
    return matchQuery && matchClass;
  });

  const transitionVisibleActiveStudents = transitionFilteredStudents.filter(s => s.is_active !== false);

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

              {loginError && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {loginError}</p>}

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

                {loginError && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {loginError}</p>}
                {forgotSuccess && <p className="text-sm text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle size={14} /> Password reset link sent to your email!</p>}

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
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${username.endsWith(ext)
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
    { type: "dues" as TabType, icon: Calculator, label: "Generate Installments / See Ledger" },
    { type: "payments" as TabType, icon: CreditCard, label: "Record Desk Payment / See Transactions" },
    { type: "transitions" as TabType, icon: ArrowRightLeft, label: "Class Transitions" },
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors text-left ${activeTab === type
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto py-6">
                      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Students</span>
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <GraduationCap size={22} />
                          </div>
                        </div>
                        <div className="my-4">
                          <p className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                            {dashboardMetrics?.total_students?.total || 0}
                          </p>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                          <TrendingUp size={14} className="text-primary" />
                          <span className="font-semibold text-primary">+{dashboardMetrics?.total_students?.added_this_month || 0}</span> added this month
                        </p>
                      </div>

                      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Parents</span>
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <UserCheck size={22} />
                          </div>
                        </div>
                        <div className="my-4">
                          <p className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                            {dashboardMetrics?.active_parents?.total || 0}
                          </p>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                          <TrendingUp size={14} className="text-primary" />
                          <span className="font-semibold text-primary">+{dashboardMetrics?.active_parents?.added_this_month || 0}</span> added this month
                        </p>
                      </div>

                      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Revenue (Month)</span>
                            <button
                              onClick={() => setShowRevenue(!showRevenue)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                              title={showRevenue ? "Hide Revenue" : "Show Revenue"}
                              aria-label={showRevenue ? "Hide Revenue" : "Show Revenue"}
                            >
                              {showRevenue ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <DollarSign size={22} />
                          </div>
                        </div>
                        <div className="my-4">
                          <p className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                            {showRevenue ? (
                              `₹${parseFloat(dashboardMetrics?.revenue?.amount || "0").toLocaleString("en-IN")}`
                            ) : (
                              "••••••"
                            )}
                          </p>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                          <TrendingUp size={14} className="text-primary" />
                          <span className="font-semibold text-primary">+{dashboardMetrics?.revenue?.percent_change || "0"}%</span> change MoM
                        </p>
                      </div>

                      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">New Admissions</span>
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Plus size={22} />
                          </div>
                        </div>
                        <div className="my-4">
                          <p className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                            {dashboardMetrics?.new_admissions?.total || 0}
                          </p>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-2 font-semibold">
                          Since {dashboardMetrics?.new_admissions?.quarter_start || "current quarter"}
                        </p>
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
                                parent_id: ""
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

                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${student.is_active
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
                                      parent_id: student.parent_id
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
                      <div className="grid grid-cols-3 gap-2">
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
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Admission Fee (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={planForm.admission_fee || ""}
                            onChange={(e) => setPlanForm({ ...planForm, admission_fee: parseFloat(e.target.value) || 0 })}
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
                                admission_fee: 0,
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
                          <th className="pb-3">Admission Fee</th>
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
                            <td className="py-3 text-foreground font-medium">₹{parseFloat(plan.admission_fee || "0").toLocaleString()}</td>
                            <td className="py-3 font-semibold capitalize text-primary">{plan.frequency}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${plan.is_active
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
                                      admission_fee: parseFloat(plan.admission_fee || "0") || 0,
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
                                  className={`p-1.5 rounded-full transition-all ${plan.is_active
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
                    {/* Create/Edit Fee Rule Form */}
                    <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        {editingRuleId !== null ? <Pencil size={16} className="text-primary" /> : <Plus size={16} className="text-primary" />}
                        {editingRuleId !== null ? "Edit discount rule" : "Create discount rule"}
                      </h3>
                      <form onSubmit={handleSaveRule} className="space-y-3">
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
                          {editingRuleId !== null ? <Save size={14} /> : <Plus size={14} />}
                          {editingRuleId !== null ? "Save Rule" : "Create Rule"}
                        </button>
                        {editingRuleId !== null && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRuleId(null);
                              setRuleForm({
                                rule_name: "",
                                discount_type: "fixed",
                                discount_value: 0,
                                applies_to: "yearly",
                                is_active: true
                              });
                            }}
                            className="w-full py-2 rounded-full border border-border text-foreground hover:bg-muted font-semibold text-xs transition-all mt-1"
                          >
                            Cancel Edit
                          </button>
                        )}
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
                                <th className="pb-3 text-right pr-3">Actions</th>
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
                                  <td className="py-3 text-right pr-3">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => {
                                          setEditingRuleId(rule.id);
                                          setRuleForm({
                                            rule_name: rule.rule_name,
                                            discount_type: rule.discount_type,
                                            discount_value: parseFloat(rule.discount_value),
                                            applies_to: (rule.applies_to || "yearly") as any,
                                            is_active: rule.is_active
                                          });
                                        }}
                                        className="text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary p-1.5 rounded-full transition-all"
                                        title="Edit Rule"
                                      >
                                        <Pencil size={12} />
                                      </button>
                                      <button
                                        onClick={() => handleToggleRuleActive(rule.id)}
                                        className={`p-1.5 rounded-full transition-all ${
                                          rule.is_active
                                            ? "text-amber-600 hover:text-amber-800 bg-amber-500/10 hover:bg-amber-500/20"
                                            : "text-emerald-600 hover:text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20"
                                        }`}
                                        title={rule.is_active ? "Inactivate Rule" : "Activate Rule"}
                                      >
                                        {rule.is_active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                      </button>
                                    </div>
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
                      <div className="relative">
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Student</label>
                        {!editingAccountId ? (
                          <>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="🔍 Search by name, admission no. or class..."
                                value={studentSelectSearch}
                                onFocus={() => setStudentSelectOpen(true)}
                                onChange={(e) => {
                                  setStudentSelectSearch(e.target.value);
                                  setStudentSelectOpen(true);
                                  // clear selection if user clears the field
                                  if (!e.target.value) {
                                    setAccountForm({ ...accountForm, student_id: 0, fee_plan_id: 0, payment_cycle: "quarterly" });
                                  }
                                }}
                                onBlur={() => setTimeout(() => setStudentSelectOpen(false), 150)}
                                className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none pr-7"
                              />
                              {accountForm.student_id > 0 && (
                                <button type="button" onClick={() => {
                                  setStudentSelectSearch("");
                                  setAccountForm({ ...accountForm, student_id: 0, fee_plan_id: 0, payment_cycle: "quarterly" });
                                }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                            {studentSelectOpen && (
                              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-52 overflow-y-auto">
                                {students.filter(s => {
                                  if (s.is_active === false) return false;
                                  const q = studentSelectSearch.toLowerCase().trim();
                                  if (!q) return true;
                                  return s.student_name.toLowerCase().includes(q) ||
                                    s.admission_number.toLowerCase().includes(q) ||
                                    s.class_name.toLowerCase().includes(q);
                                }).length === 0 ? (
                                  <div className="px-3 py-2 text-xs text-muted-foreground">No students found</div>
                                ) : (
                                  students.filter(s => {
                                    if (s.is_active === false) return false;
                                    const q = studentSelectSearch.toLowerCase().trim();
                                    if (!q) return true;
                                    return s.student_name.toLowerCase().includes(q) ||
                                      s.admission_number.toLowerCase().includes(q) ||
                                      s.class_name.toLowerCase().includes(q);
                                  }).map(s => (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onMouseDown={() => {
                                        setAccountForm({ ...accountForm, student_id: s.id, fee_plan_id: 0, payment_cycle: "quarterly" });
                                        setStudentSelectSearch(`${s.student_name} [${s.admission_number}]`);
                                        setStudentSelectOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs hover:bg-muted/60 transition-colors flex items-center justify-between ${accountForm.student_id === s.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground"}`}
                                    >
                                      <span>{s.student_name} <span className="text-muted-foreground font-normal">[{s.admission_number}]</span></span>
                                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground ml-2 shrink-0">{s.class_name}</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                            {/* Selected student detail badge */}
                            {accountForm.student_id > 0 && (() => {
                              const sel = students.find(s => s.id === accountForm.student_id);
                              return sel ? (
                                <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 bg-primary/5 border border-primary/20 rounded-xl">
                                  <span className="text-[10px] font-semibold text-primary">{sel.student_name}</span>
                                  <span className="text-[10px] text-muted-foreground">[{sel.admission_number}]</span>
                                  <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">{sel.class_name}</span>
                                </div>
                              ) : null;
                            })()}
                          </>
                        ) : (
                          /* In edit mode, show a locked read-only badge */
                          (() => {
                            const sel = students.find(s => s.id === accountForm.student_id);
                            return (
                              <div className="w-full px-3 py-2 rounded-xl bg-muted/50 border-0 text-xs text-muted-foreground opacity-60 cursor-not-allowed flex items-center gap-2">
                                {sel ? <>{sel.student_name} [{sel.admission_number}]<span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{sel.class_name}</span></> : "Student locked"}
                              </div>
                            );
                          })()
                        )}
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

                      <div className="flex items-center gap-2 py-1.5">
                        <input
                          id="charge-admission-fee-checkbox"
                          type="checkbox"
                          checked={accountForm.charge_admission_fee}
                          onChange={(e) => setAccountForm({ ...accountForm, charge_admission_fee: e.target.checked })}
                          className="rounded border-border bg-muted text-primary focus:ring-ring h-4 w-4 transition-all cursor-pointer"
                        />
                        <label htmlFor="charge-admission-fee-checkbox" className="text-xs font-semibold text-foreground select-none cursor-pointer">
                          Charge One-time Admission Fee (First Term only)
                        </label>
                      </div>

                      <div className="p-3 bg-muted/40 rounded-2xl border border-border/50 space-y-2">
                        <label className="block text-xs font-bold text-foreground">Select Discount Rule (Sibling / Special)</label>
                        <div>
                          <select
                            value={(() => {
                              const matched = feeRules.find(r => r.discount_type === accountForm.discount_type && parseFloat(r.discount_value) === accountForm.discount_value);
                              return matched ? matched.id : "";
                            })()}
                            onChange={(e) => {
                              const ruleId = Number(e.target.value);
                              const selectedRule = feeRules.find(r => r.id === ruleId);
                              if (selectedRule) {
                                setAccountForm({
                                  ...accountForm,
                                  discount_type: selectedRule.discount_type as any,
                                  discount_value: parseFloat(selectedRule.discount_value) || 0,
                                  notes: selectedRule.rule_name
                                });
                              } else {
                                setAccountForm({
                                  ...accountForm,
                                  discount_type: "",
                                  discount_value: 0,
                                  notes: ""
                                });
                              }
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          >
                            <option value="">No Discount</option>
                            {feeRules.filter(r => r.is_active && r.applies_to !== "yearly" && r.rule_name !== "full_year_discount" && r.rule_name !== "Full Year Discount").map(r => (
                              <option key={r.id} value={r.id}>
                                {r.rule_name} ({r.discount_type === "fixed" ? `₹${parseFloat(r.discount_value).toLocaleString()}` : `${parseFloat(r.discount_value)}%`})
                              </option>
                            ))}
                          </select>
                        </div>

                        {accountForm.discount_type === "fixed" && (
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground mb-1">Discount Application Mode</label>
                            <select
                              value={accountForm.discount_mode}
                              onChange={(e) => setAccountForm({ ...accountForm, discount_mode: e.target.value as any })}
                              className="w-full px-2.5 py-1.5 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none font-medium"
                            >
                              <option value="divided">Proportional / Divided across terms</option>
                              <option value="first_term">Apply fully on Term 1 only</option>
                            </select>
                          </div>
                        )}

                        {accountForm.discount_type && (
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground mb-1">Discount Value & Reason</label>
                            <div className="text-[11px] font-semibold text-primary px-2.5 py-1.5 bg-muted rounded-xl border border-border/30">
                              {accountForm.discount_type === "fixed" ? `₹${accountForm.discount_value.toLocaleString()}` : `${accountForm.discount_value}%`} — {accountForm.notes}
                            </div>
                          </div>
                        )}
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
                            setAccountForm({
                              student_id: 0,
                              fee_plan_id: 0,
                              payment_cycle: "quarterly",
                              effective_from: new Date().toISOString().split("T")[0],
                              installments: 3,
                              discount_type: "",
                              discount_value: 0,
                              discount_mode: "divided",
                              notes: "",
                              charge_admission_fee: false
                            });
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
                          const matchesActive = !hideInactiveAccounts || (studentObj?.is_active !== false && account.is_active !== false);

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
                            <tr key={account.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors ${editingAccountId === account.id ? "bg-primary/5 ring-1 ring-primary/20" : ""} ${!account.is_active ? "opacity-60 bg-muted/10" : ""}`}>
                              <td className="py-3 text-foreground">
                                <span className="font-medium">{studentName}</span>
                                {account.discount_type && account.discount_value && parseFloat(account.discount_value as any) > 0 && (
                                  <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20" title={`${account.notes || "Subscription discount applied"} (${account.discount_mode === "first_term" ? "Term 1 only" : "Divided"})`}>
                                    🏷️ {parseFloat(account.discount_value as any).toLocaleString()}{account.discount_type === "percentage" ? "%" : " INR"} Off
                                  </span>
                                )}
                                {account.charge_admission_fee && (
                                  <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20" title="Includes one-time Admission Fee in Term 1">
                                    ➕ Admission Fee
                                  </span>
                                )}
                                {!account.is_active && (
                                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/10">
                                    Inactive
                                  </span>
                                )}
                              </td>
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
                                        installments: account.installments || 3,
                                        discount_type: (account.discount_type || "") as any,
                                        discount_value: parseFloat(account.discount_value || "0") || 0,
                                        discount_mode: (account.discount_mode || "divided") as any,
                                        notes: account.notes || "",
                                        charge_admission_fee: account.charge_admission_fee || false
                                      });
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                    title="Edit subscription"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCustomDueForm({
                                        fee_account_id: account.id,
                                        due_title: "",
                                        amount: 0,
                                        due_date: new Date().toISOString().split("T")[0],
                                        remarks: ""
                                      });
                                      setIsCustomDueModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                    title="Add custom charge/due"
                                  >
                                    <PlusCircle size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleSubscriptionActive(account)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      account.is_active
                                        ? "hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500"
                                        : "hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500"
                                    }`}
                                    title={account.is_active ? "Deactivate subscription" : "Activate subscription"}
                                  >
                                    {account.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
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
                      <div className="relative">
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Student Fee Subscription</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="🔍 Search by name, admission no. or cycle..."
                            value={subscriptionSelectSearch}
                            onFocus={() => setSubscriptionSelectOpen(true)}
                            onChange={(e) => {
                              setSubscriptionSelectSearch(e.target.value);
                              setSubscriptionSelectOpen(true);
                              if (!e.target.value) {
                                setGenerateForm({ ...generateForm, fee_account_id: 0, starting_installment: 1, installment_count: 3 });
                              }
                            }}
                            onBlur={() => setTimeout(() => setSubscriptionSelectOpen(false), 150)}
                            className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none pr-7"
                          />
                          {generateForm.fee_account_id > 0 && (
                            <button type="button" onClick={() => {
                              setSubscriptionSelectSearch("");
                              setGenerateForm({ ...generateForm, fee_account_id: 0, starting_installment: 1, installment_count: 3 });
                            }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        {subscriptionSelectOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-52 overflow-y-auto">
                            {feeAccounts.filter(a => {
                              const student = students.find(s => s.id === a.student_id);
                              if (!student || student.is_active === false || a.is_active === false) return false;
                              const q = subscriptionSelectSearch.toLowerCase().trim();
                              if (!q) return true;
                              return student.student_name.toLowerCase().includes(q) ||
                                student.admission_number.toLowerCase().includes(q) ||
                                a.payment_cycle.toLowerCase().includes(q) ||
                                student.class_name.toLowerCase().includes(q);
                            }).length === 0 ? (
                              <div className="px-3 py-2 text-xs text-muted-foreground">No active subscriptions found</div>
                            ) : (
                              feeAccounts.filter(a => {
                                const student = students.find(s => s.id === a.student_id);
                                if (!student || student.is_active === false || a.is_active === false) return false;
                                const q = subscriptionSelectSearch.toLowerCase().trim();
                                if (!q) return true;
                                return student.student_name.toLowerCase().includes(q) ||
                                  student.admission_number.toLowerCase().includes(q) ||
                                  a.payment_cycle.toLowerCase().includes(q) ||
                                  student.class_name.toLowerCase().includes(q);
                              }).map(a => {
                                const sObj = students.find(s => s.id === a.student_id);
                                const label = sObj ? `${sObj.student_name} [${sObj.admission_number}]` : "Student";
                                const cycleLabel = a.payment_cycle === "quarterly" ? `Quarterly - ${a.installments || 3} Inst` : a.payment_cycle;
                                return (
                                  <button
                                    key={a.id}
                                    type="button"
                                    onMouseDown={() => {
                                      const cycle = a.payment_cycle || "quarterly";
                                      const defaultCount = cycle === "yearly" ? 1 : cycle === "quarterly" ? (a.installments ?? 3) : 12;
                                      setGenerateForm({ ...generateForm, fee_account_id: a.id, starting_installment: 1, installment_count: defaultCount });
                                      setSubscriptionSelectSearch(`${label} (${cycleLabel})`);
                                      setSubscriptionSelectOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-muted/60 transition-colors flex items-center justify-between ${generateForm.fee_account_id === a.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground"}`}
                                  >
                                    <span>{sObj?.student_name} <span className="text-muted-foreground font-normal">[{sObj?.admission_number}]</span></span>
                                    <span className="flex items-center gap-1.5 shrink-0 ml-2">
                                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{sObj?.class_name}</span>
                                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full capitalize">{cycleLabel}</span>
                                    </span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                        {/* Selected subscription detail badge */}
                        {generateForm.fee_account_id > 0 && (() => {
                          const selAcc = feeAccounts.find(a => a.id === generateForm.fee_account_id);
                          const selStu = selAcc ? students.find(s => s.id === selAcc.student_id) : null;
                          if (!selAcc || !selStu) return null;
                          const cycleLabel = selAcc.payment_cycle === "quarterly" ? `Quarterly · ${selAcc.installments || 3} terms` : selAcc.payment_cycle;
                          return (
                            <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 bg-primary/5 border border-primary/20 rounded-xl flex-wrap">
                              <span className="text-[10px] font-semibold text-primary">{selStu.student_name}</span>
                              <span className="text-[10px] text-muted-foreground">[{selStu.admission_number}]</span>
                              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{selStu.class_name}</span>
                              <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold capitalize">{cycleLabel}</span>
                            </div>
                          );
                        })()}
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
                        if (!selectedAcc) return null;
                        const cycle = selectedAcc?.payment_cycle || "quarterly";
                        const maxInstallments = cycle === "yearly" ? 1 : cycle === "quarterly" ? (selectedAcc?.installments ?? 3) : 12;
                        return (
                          <div className="grid grid-cols-2 gap-4 bg-muted/40 p-3 rounded-2xl border border-border/50 text-xs">
                            <div>
                              <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Starting Installment</span>
                              <span className="font-bold text-foreground">Term 1</span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Total Installments</span>
                              <span className="font-bold text-primary">{maxInstallments} Installment{maxInstallments > 1 ? "s" : ""}</span>
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
                          <th className="pb-3 whitespace-nowrap">Title / Period</th>
                          <th className="pb-3 whitespace-nowrap">Billed (Net)</th>
                          <th className="pb-3 whitespace-nowrap">Paid</th>
                          <th className="pb-3 whitespace-nowrap">Balance</th>
                          <th className="pb-3 text-right whitespace-nowrap">Status</th>
                          <th className="pb-3 text-right pr-3 whitespace-nowrap">Actions</th>
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
                                <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
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
                                  <td colSpan={6} className="py-2.5 px-3 font-semibold text-primary text-[10px] uppercase tracking-wider text-left select-none">
                                    <div className="flex items-center gap-1.5">
                                      {isExpanded ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />}
                                      <span>👤 {group.studentName}</span>
                                      <span className="text-muted-foreground ml-1 font-mono">({group.admissionNumber})</span>
                                      {(() => {
                                        const studentObj = students.find(s => s.id === group.studentId);
                                        return studentObj ? (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedStudentForView(studentObj);
                                            }}
                                            className="ml-3 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] hover:bg-primary hover:text-primary-foreground font-bold transition-all normal-case tracking-normal"
                                            title="View student's full financial statement"
                                          >
                                            View Full Ledger
                                          </button>
                                        ) : null;
                                      })()}
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
                                    <td className="py-3 font-semibold text-foreground">
                                      <div>₹{parseFloat(due.final_amount).toLocaleString()}</div>
                                      {(parseFloat(due.discount_applied) > 0 || parseFloat(due.admission_fee || "0") > 0) && (
                                        <div className="text-[9px] text-muted-foreground mt-0.5 normal-case font-normal">
                                          ₹{parseFloat(due.original_amount).toLocaleString()}
                                          {parseFloat(due.discount_applied) > 0 && ` - ₹${parseFloat(due.discount_applied).toLocaleString()} disc`}
                                          {parseFloat(due.admission_fee || "0") > 0 && ` + ₹${parseFloat(due.admission_fee).toLocaleString()} adm`}
                                        </div>
                                      )}
                                    </td>
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
                  <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4 self-start">
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

                  {/* Historical payments audit ledger */}
                  <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between overflow-x-auto">
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-1.5">
                        <CheckCircle size={16} className="text-primary" /> Historical payments audit ledger
                      </h3>
                      {payments.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-8 text-center">No payment transactions recorded yet.</p>
                      ) : (
                        <>
                          <div className="mb-4">
                            <input
                              type="text"
                              value={paymentSearchQuery}
                              onChange={(e) => {
                                setPaymentSearchQuery(e.target.value);
                                setPaymentsPage(1);
                              }}
                              placeholder="Search transactions (student, ID, mode, status...)"
                              className="w-full max-w-md px-3.5 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none transition-all"
                            />
                          </div>

                          {(() => {
                            const filteredPayments = payments.filter((p) => {
                              const student = students.find((s) => s.id === p.student_id);
                              const query = paymentSearchQuery.toLowerCase().trim();
                              if (!query) return true;

                              const studentName = student?.student_name || "";
                              const admissionNum = student?.admission_number || "";
                              const remarks = p.remarks || "";
                              const gatewayPayId = p.gateway_payment_id || "";
                              const gatewayOrderId = p.gateway_order_id || "";
                              const mode = p.payment_mode || "";
                              const status = p.status || "";
                              const amountStr = String(p.amount_paid);
                              const totalAmtStr = String(parseFloat(p.amount_paid) + parseFloat(p.gateway_charges || "0.00") + parseFloat(p.gateway_charges_gst || "0.00"));

                              return studentName.toLowerCase().includes(query) ||
                                admissionNum.toLowerCase().includes(query) ||
                                remarks.toLowerCase().includes(query) ||
                                gatewayPayId.toLowerCase().includes(query) ||
                                gatewayOrderId.toLowerCase().includes(query) ||
                                mode.toLowerCase().includes(query) ||
                                status.toLowerCase().includes(query) ||
                                amountStr.includes(query) ||
                                totalAmtStr.includes(query);
                            });

                            if (filteredPayments.length === 0) {
                              return <p className="text-xs text-muted-foreground italic py-8 text-center">No transaction records match your search.</p>;
                            }

                            return (
                              <>
                                <table className="w-full text-xs text-left">
                                  <thead>
                                    <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                      <th className="pb-2.5">Student</th>
                                      <th className="pb-2.5">Amount</th>
                                      <th className="pb-2.5">Mode</th>
                                      <th className="pb-2.5">Date</th>
                                      <th className="pb-2.5">Status</th>
                                      <th className="pb-2.5 text-right pr-2">Details</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredPayments.slice((paymentsPage - 1) * 10, paymentsPage * 10).map((p) => {
                                      const student = students.find((s) => s.id === p.student_id);
                                      const baseAmt = parseFloat(p.amount_paid);

                                      return (
                                        <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors">
                                          <td className="py-2.5">
                                            <p className="font-semibold text-foreground">{student ? student.student_name : `Student ID: ${p.student_id}`}</p>
                                            <p className="text-[9px] text-muted-foreground font-mono">{student ? student.admission_number : "N/A"}</p>
                                          </td>
                                          <td className="py-2.5 font-bold text-foreground">
                                            ₹{baseAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                          </td>
                                          <td className="py-2.5 uppercase text-[9px] font-semibold text-muted-foreground">{p.payment_mode.replace("_", " ")}</td>
                                          <td className="py-2.5 text-muted-foreground font-mono text-[9px]">{new Date(p.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</td>
                                          <td className="py-2.5">
                                            <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${p.status === "success"
                                              ? "bg-emerald-500/10 text-emerald-700"
                                              : p.status === "pending"
                                                ? "bg-amber-500/10 text-amber-700"
                                                : "bg-rose-500/10 text-rose-700"
                                              }`}>
                                              {p.status}
                                            </span>
                                          </td>
                                          <td className="py-2.5 text-right pr-2">
                                            <button
                                              type="button"
                                              onClick={() => setSelectedPaymentForDetails(p)}
                                              className="p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-muted/80 transition-all"
                                              title="View transaction details & download receipt"
                                            >
                                              <Eye size={12} />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>

                                {/* Pagination controls */}
                                {(() => {
                                  const totalPaymentsPages = Math.ceil(filteredPayments.length / 10) || 1;
                                  if (totalPaymentsPages <= 1) return null;
                                  return (
                                    <div className="flex items-center justify-between border-t border-border pt-4 mt-4 text-xs">
                                      <span className="text-muted-foreground">
                                        Showing payments {Math.min(filteredPayments.length, (paymentsPage - 1) * 10 + 1)}-{Math.min(filteredPayments.length, paymentsPage * 10)} of {filteredPayments.length}
                                      </span>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          disabled={paymentsPage === 1}
                                          onClick={() => setPaymentsPage(prev => Math.max(prev - 1, 1))}
                                          className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-all font-medium"
                                        >
                                          Previous
                                        </button>
                                        <button
                                          type="button"
                                          disabled={paymentsPage === totalPaymentsPages}
                                          onClick={() => setPaymentsPage(prev => Math.min(prev + 1, totalPaymentsPages))}
                                          className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-all font-medium"
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 8. Class Transitions and Promotion Panel */}
            {activeTab === "transitions" && (
              <motion.div
                key="transitions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Class Transitions & Promotions</h1>
                    <p className="text-sm text-muted-foreground mt-0.5 font-sans">
                      Promote active students to new classes or mark them as graduated when they finish Mont 3.
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                  {/* Filter and Selection Tools */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {/* Search Input */}
                      <div className="relative min-w-[240px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          value={transitionSearchQuery}
                          onChange={(e) => setTransitionSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                          placeholder="Search student or admission number..."
                        />
                      </div>
                      {/* Class Filter */}
                      <select
                        value={transitionClassFilter}
                        onChange={(e) => setTransitionClassFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                      >
                        <option value="All">All Current Classes</option>
                        <option value="Montessori-1">Montessori-1</option>
                        <option value="Montessori-2">Montessori-2</option>
                        <option value="Montessori-3">Montessori-3</option>
                        <option value="Toddlers">Toddlers</option>
                        <option value="Daycare">Daycare</option>
                      </select>
                    </div>

                    {/* Bulk Operations buttons */}
                    {selectedTransitionStudentIds.length > 0 && (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end bg-primary/5 px-4 py-2 rounded-2xl border border-primary/20 animate-pulse">
                        <span className="text-xs font-semibold text-primary">
                          {selectedTransitionStudentIds.length} Selected
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setTransitionNewClassName("Montessori-2");
                            setIsTransitionModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-primary text-primary-foreground hover:shadow-md text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                        >
                          <ArrowRightLeft size={14} /> Promote / Transition
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGraduateChecked(false);
                            setIsGraduateModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                        >
                          <GraduationCap size={14} /> Graduate
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Student Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                          <th className="pb-3 w-12">
                            <input
                              type="checkbox"
                              checked={
                                transitionVisibleActiveStudents.length > 0 &&
                                transitionVisibleActiveStudents.every(s => selectedTransitionStudentIds.includes(s.id))
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const visibleActiveIds = transitionVisibleActiveStudents.map(s => s.id);
                                  setSelectedTransitionStudentIds(prev => Array.from(new Set([...prev, ...visibleActiveIds])));
                                } else {
                                  const visibleActiveIds = transitionVisibleActiveStudents.map(s => s.id);
                                  setSelectedTransitionStudentIds(prev => prev.filter(id => !visibleActiveIds.includes(id)));
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                            />
                          </th>
                          <th className="pb-3">Student Name</th>
                          <th className="pb-3">Admission Number</th>
                          <th className="pb-3">Current Class</th>
                          <th className="pb-3">Academic Year</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const list = transitionFilteredStudents;

                          if (list.length === 0) {
                            return (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                  No students match your current filter selection.
                                </td>
                              </tr>
                            );
                          }

                          return list.map((student) => {
                            const isSelected = selectedTransitionStudentIds.includes(student.id);
                            const isGraduated = student.is_active === false;
                            return (
                              <tr
                                key={student.id}
                                className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${isGraduated ? "opacity-60 grayscale-[10%]" : ""
                                  }`}
                              >
                                <td className="py-3">
                                  {!isGraduated ? (
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {
                                        if (isSelected) {
                                          setSelectedTransitionStudentIds(
                                            selectedTransitionStudentIds.filter((id) => id !== student.id)
                                          );
                                        } else {
                                          setSelectedTransitionStudentIds([
                                            ...selectedTransitionStudentIds,
                                            student.id,
                                          ]);
                                        }
                                      }}
                                      className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="py-3 font-semibold text-foreground">
                                  {student.student_name}
                                </td>
                                <td className="py-3 text-muted-foreground font-mono">
                                  {student.admission_number}
                                </td>
                                <td className="py-3 text-muted-foreground">
                                  {student.class_name}
                                </td>
                                <td className="py-3 text-muted-foreground">
                                  {student.academic_year}
                                </td>
                                <td className="py-3">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${isGraduated
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    }`}>
                                    {isGraduated ? "Graduated" : "Active"}
                                  </span>
                                </td>
                                <td className="py-3 text-right space-x-1.5">
                                  {!isGraduated ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedTransitionStudentIds([student.id]);
                                          setTransitionNewClassName(
                                            student.class_name === "Montessori-1"
                                              ? "Montessori-2"
                                              : student.class_name === "Montessori-2"
                                                ? "Montessori-3"
                                                : "Montessori-1"
                                          );
                                          setIsTransitionModalOpen(true);
                                        }}
                                        className="px-2 py-1 border border-primary/20 text-primary hover:bg-primary/5 rounded-lg font-medium text-[11px] transition-all"
                                      >
                                        Transition
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedTransitionStudentIds([student.id]);
                                          setGraduateChecked(false);
                                          setIsGraduateModalOpen(true);
                                        }}
                                        className="px-2 py-1 border border-rose-500/20 text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-[11px] dark:hover:bg-rose-950/20 transition-all"
                                      >
                                        Graduate
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground font-sans">No actions</span>
                                  )}
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modals inside transitions block */}
                {/* 1. Promote / Transition Modal */}
                <AnimatePresence>
                  {isTransitionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
                      <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-foreground"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-border">
                          <h3 className="font-semibold text-base flex items-center gap-1.5">
                            <ArrowRightLeft size={18} className="text-primary" /> Promote / Transition Students
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setIsTransitionModalOpen(false);
                              setSelectedTransitionStudentIds([]);
                            }}
                            className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <form onSubmit={handleBulkTransition} className="space-y-4">
                          <p className="text-xs text-muted-foreground">
                            You are transitioning <strong className="text-foreground">{selectedTransitionStudentIds.length}</strong> selected student(s). Their current class subscription fee accounts will be automatically deactivated and carry-forward subscriptions will be created for the new class.
                          </p>

                          {transitionStudentsWithUnpaidDues.length > 0 && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col gap-1.5 text-xs text-amber-800 dark:text-amber-300">
                              <div className="flex items-start gap-2.5">
                                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                                <div>
                                  <strong className="block font-semibold">Outstanding Balance Warning:</strong>
                                  <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                                    The following student(s) have unpaid or partially paid installment dues that will remain outstanding:
                                  </p>
                                </div>
                              </div>
                              <div className="max-h-[100px] overflow-y-auto space-y-1.5 mt-1 pl-6">
                                {transitionStudentsWithUnpaidDues.map((item) => (
                                  <div key={item.student?.id} className="flex justify-between text-[11px] font-medium border-b border-amber-500/10 pb-1 last:border-0 last:pb-0">
                                    <span>• {item.student?.student_name}</span>
                                    <span>₹{item.totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Target Class / Program</label>
                            <select
                              required
                              value={transitionNewClassName}
                              onChange={(e) => setTransitionNewClassName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                            >
                              <option value="Montessori-1">Montessori-1</option>
                              <option value="Montessori-2">Montessori-2</option>
                              <option value="Montessori-3">Montessori-3</option>
                              <option value="Toddlers">Toddlers</option>
                              <option value="Daycare">Daycare</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">New Academic Year</label>
                            <input
                              type="text"
                              required
                              value={transitionNewAcademicYear}
                              onChange={(e) => setTransitionNewAcademicYear(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                              placeholder="2026-2027"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsTransitionModalOpen(false);
                                setSelectedTransitionStudentIds([]);
                              }}
                              className="px-4 py-2 border border-border text-muted-foreground rounded-full text-xs font-semibold hover:bg-muted transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-primary text-primary-foreground hover:shadow-md rounded-full text-xs font-semibold transition-all"
                            >
                              Transition Students
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* 2. Graduate Modal */}
                <AnimatePresence>
                  {isGraduateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
                      <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-foreground"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-border">
                          <h3 className="font-semibold text-base text-rose-600 flex items-center gap-1.5">
                            <GraduationCap size={18} /> Graduate / Deactivate Students
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setIsGraduateModalOpen(false);
                              setSelectedTransitionStudentIds([]);
                            }}
                            className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                            <AlertCircle className="shrink-0 mt-0.5" size={16} />
                            <p>
                              <strong>Warning:</strong> Graduating <strong className="text-foreground">{selectedTransitionStudentIds.length}</strong> student(s) will mark them as inactive (graduated). Their active fee plans will be deactivated, stopping future dues generation. Parent accounts will remain active.
                            </p>
                          </div>

                          {transitionStudentsWithUnpaidDues.length > 0 && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col gap-1.5 text-xs text-amber-800 dark:text-amber-300">
                              <div className="flex items-start gap-2.5">
                                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                                <div>
                                  <strong className="block font-semibold">Outstanding Balance Warning:</strong>
                                  <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                                    The following student(s) have unpaid or partially paid installment dues that will remain outstanding:
                                  </p>
                                </div>
                              </div>
                              <div className="max-h-[100px] overflow-y-auto space-y-1.5 mt-1 pl-6">
                                {transitionStudentsWithUnpaidDues.map((item) => (
                                  <div key={item.student?.id} className="flex justify-between text-[11px] font-medium border-b border-amber-500/10 pb-1 last:border-0 last:pb-0">
                                    <span>• {item.student?.student_name}</span>
                                    <span>₹{item.totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={graduateChecked}
                              onChange={(e) => setGraduateChecked(e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                              I understand this action cannot be easily undone.
                            </span>
                          </label>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsGraduateModalOpen(false);
                                setSelectedTransitionStudentIds([]);
                              }}
                              className="px-4 py-2 border border-border text-muted-foreground rounded-full text-xs font-semibold hover:bg-muted transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={!graduateChecked}
                              onClick={handleBulkGraduate}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md rounded-full text-xs font-semibold transition-all"
                            >
                              Confirm Graduation
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
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
              <div className="bg-gradient-to-r from-amber-500/10 to-primary/5 p-6 border-b border-border flex items-center gap-4 rounded-t-[22px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedStudentForView.student_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedStudentForView.student_name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-muted text-muted-foreground rounded-full">
                      Adm: {selectedStudentForView.admission_number}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${selectedStudentForView.is_active
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
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${sub.is_active ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"
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

                {/* 4. Student Financial Ledger */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Calculator size={14} className="text-primary" /> Student Financial Ledger
                  </h4>
                  {(() => {
                    const studentDues = allDues.filter((d) => d.student_id === selectedStudentForView.id);
                    if (studentDues.length === 0) {
                      return <p className="text-xs text-muted-foreground italic">No fee due installments generated yet.</p>;
                    }

                    const totalBilled = studentDues.reduce((sum, d) => sum + parseFloat(d.final_amount), 0);
                    const totalPaid = studentDues.reduce((sum, d) => sum + parseFloat(d.paid_amount), 0);
                    const totalRemaining = studentDues.reduce((sum, d) => sum + parseFloat(d.balance), 0);

                    return (
                      <div className="space-y-4">
                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 bg-muted/40 border border-border/50 p-4 rounded-2xl text-center text-xs">
                          <div>
                            <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Total Billed</span>
                            <span className="text-sm font-bold text-foreground">₹{totalBilled.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5 text-emerald-600">Already Paid</span>
                            <span className="text-sm font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5 text-primary">Remaining</span>
                            <span className="text-sm font-bold text-primary">₹{totalRemaining.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* List of all dues (including paid ones) */}
                        <div className="border border-border/60 rounded-2xl overflow-x-auto bg-card">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="bg-muted/40 border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <th className="py-2.5 px-4 whitespace-nowrap">Title</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Billed (Net)</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Paid</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Balance</th>
                                <th className="py-2.5 px-3 text-right pr-4 whitespace-nowrap">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentDues.map((due) => {
                                const duePayments = payments.filter((p) => p.fee_due_id === due.id && p.status === "success");

                                return (
                                  <tr key={due.id} className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors">
                                    <td className="py-3 px-4">
                                      <p className="font-semibold text-foreground truncate max-w-[130px]" title={due.due_title}>{due.due_title}</p>
                                      {due.remarks && <p className="text-[9px] text-muted-foreground italic truncate max-w-[130px]" title={due.remarks}>{due.remarks}</p>}
                                    </td>
                                    <td className="py-3 px-3 text-muted-foreground font-mono text-[10px]">{due.due_date}</td>
                                    <td className="py-3 px-3 font-semibold text-foreground">
                                      <div>₹{parseFloat(due.final_amount).toLocaleString()}</div>
                                      {(parseFloat(due.discount_applied) > 0 || parseFloat(due.admission_fee || "0") > 0) && (
                                        <div className="text-[9px] text-muted-foreground mt-0.5 normal-case font-normal">
                                          ₹{parseFloat(due.original_amount).toLocaleString()}
                                          {parseFloat(due.discount_applied) > 0 && ` - ₹${parseFloat(due.discount_applied).toLocaleString()} disc`}
                                          {parseFloat(due.admission_fee || "0") > 0 && ` + ₹${parseFloat(due.admission_fee).toLocaleString()} adm`}
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-3 px-3 text-emerald-600 font-medium">
                                      <div className="flex items-center gap-1.5">
                                        <span>₹{parseFloat(due.paid_amount).toLocaleString()}</span>
                                        {duePayments.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => setSelectedDueForReceiptDetails(due)}
                                            className="p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-muted/80 transition-all"
                                            title="View payment breakdown & download receipt"
                                          >
                                            <Eye size={12} />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-3 px-3 font-semibold text-primary">₹{parseFloat(due.balance).toLocaleString()}</td>
                                    <td className="py-3 px-3 text-right pr-4">
                                      <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${due.status === "paid"
                                        ? "bg-emerald-500/10 text-emerald-700"
                                        : due.status === "partial"
                                          ? "bg-amber-500/10 text-amber-700"
                                          : due.status === "overdue"
                                            ? "bg-rose-500/10 text-rose-700"
                                            : "bg-blue-500/10 text-blue-700"
                                        }`}>
                                        {due.status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
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
              <div className="bg-gradient-to-r from-amber-500/10 to-primary/5 p-6 border-b border-border flex items-center gap-4 rounded-t-[22px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedParentForView.full_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedParentForView.full_name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-muted text-muted-foreground rounded-full">
                      ID: {selectedParentForView.id}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${selectedParentForView.is_active
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

      {/* Custom Standalone Due Modal */}
      <AnimatePresence>
        {isCustomDueModalOpen && (
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
              className="bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl flex flex-col relative text-foreground"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsCustomDueModalOpen(false)}
                  className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border rounded-t-[22px]">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Calculator size={18} className="text-primary" /> Add Custom Charge / Due
                </h3>
                <p className="text-xs text-muted-foreground mt-1">This will show up on the parent portal as an installment.</p>
              </div>

              <form onSubmit={handleCreateCustomDue} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Student</label>
                  <input
                    type="text"
                    disabled
                    value={(() => {
                      const acc = feeAccounts.find(a => a.id === customDueForm.fee_account_id);
                      const stu = acc ? students.find(s => s.id === acc.student_id) : null;
                      return stu ? `${stu.student_name} [${stu.admission_number}]` : "Unknown";
                    })()}
                    className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs font-medium text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Due Title / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uniform Fee, Daycare Buffer, Camp Fee"
                    value={customDueForm.due_title}
                    onChange={(e) => setCustomDueForm({ ...customDueForm, due_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Amount to pay"
                    value={customDueForm.amount || ""}
                    onChange={(e) => setCustomDueForm({ ...customDueForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={customDueForm.due_date}
                    onChange={(e) => setCustomDueForm({ ...customDueForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Remarks / Note for Parent (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details of this charge..."
                    value={customDueForm.remarks}
                    onChange={(e) => setCustomDueForm({ ...customDueForm, remarks: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border-0 text-xs focus:ring-2 focus:ring-ring outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomDueModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all"
                  >
                    Add Charge
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Breakdown Modal */}
      <AnimatePresence>
        {selectedDueForReceiptDetails && (
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
              className="bg-card border border-border rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative text-foreground"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedDueForReceiptDetails(null)}
                  className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-primary/5 p-6 border-b border-border flex items-center gap-4 rounded-t-[22px]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Actual Payment Breakdown</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{selectedDueForReceiptDetails.due_title}</p>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-6">
                {/* Due Billed breakdown */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Installment Structure Billed</h4>
                  <div className="space-y-2.5 bg-muted/30 border border-border/40 p-4 rounded-2xl text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tuition Fee component:</span>
                      <span className="font-semibold text-foreground">₹{parseFloat(selectedDueForReceiptDetails.tuition_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                    {parseFloat(selectedDueForReceiptDetails.resource_fee) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resource Fee component:</span>
                        <span className="font-semibold text-foreground">₹{parseFloat(selectedDueForReceiptDetails.resource_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                     {parseFloat(selectedDueForReceiptDetails.admission_fee || "0") > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Admission Fee component:</span>
                        <span className="font-semibold text-foreground">₹{parseFloat(selectedDueForReceiptDetails.admission_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {parseFloat(selectedDueForReceiptDetails.discount_applied) > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount Applied component:</span>
                        <span>-₹{parseFloat(selectedDueForReceiptDetails.discount_applied).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border/60 pt-2.5 font-bold text-foreground text-sm">
                      <span>Total Net Billed:</span>
                      <span>₹{parseFloat(selectedDueForReceiptDetails.final_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Successful Payments List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recorded Transaction Allocations</h4>
                  {(() => {
                    const duePayments = payments.filter((p) => p.fee_due_id === selectedDueForReceiptDetails.id && p.status === "success");
                    if (duePayments.length === 0) {
                      return <p className="text-xs text-muted-foreground italic bg-muted/20 p-4 rounded-xl text-center">No successful transactions recorded for this due.</p>;
                    }
                    return (
                      <div className="space-y-3">
                        {duePayments.map((p) => {
                          const base = parseFloat(p.amount_paid);
                          const charges = parseFloat(p.gateway_charges || "0.00");
                          const gst = parseFloat(p.gateway_charges_gst || "0.00");
                          const total = base + charges + gst;

                          return (
                            <div key={p.id} className="border border-border/50 rounded-2xl p-4 bg-card shadow-sm space-y-3">
                              <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                                <span className="font-bold text-foreground">AMH-REC-{p.id}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">{new Date(p.paid_at || p.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tuition Cleared (School):</span>
                                  <span className="font-semibold text-foreground">₹{base.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                </div>
                                {charges > 0 && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Gateway Convenience Charges (2%):</span>
                                      <span className="font-medium text-foreground">₹{charges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">GST on Gateway Charges (18%):</span>
                                      <span className="font-medium text-foreground">₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                  </>
                                )}
                                <div className="flex justify-between border-t border-border/40 pt-2 font-bold text-primary text-sm">
                                  <span>Actual Amount Paid:</span>
                                  <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                                  <span>Mode: <strong className="uppercase">{p.payment_mode.replace("_", " ")}</strong></span>
                                  {p.remarks && <span className="italic truncate max-w-[180px]">Note: {p.remarks}</span>}
                                </div>
                              </div>
                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => handlePrintReceipt(p)}
                                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-all"
                                >
                                  Download Printable Receipt
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDueForReceiptDetails(null)}
                  className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Payment Details Modal */}
      <AnimatePresence>
        {selectedPaymentForDetails && (() => {
          const p = selectedPaymentForDetails;
          const student = students.find((s) => s.id === p.student_id);
          const studentName = student ? student.student_name : "Student";
          const parent = profiles.find((prof) => prof.id === student?.parent_id);
          const due = allDues.find((d) => d.id === p.fee_due_id);

          const base = parseFloat(p.amount_paid);
          const charges = parseFloat(p.gateway_charges || "0.00");
          const gst = parseFloat(p.gateway_charges_gst || "0.00");
          const total = base + charges + gst;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-card border border-border rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative text-foreground"
              >
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => setSelectedPaymentForDetails(null)}
                    className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-primary/5 p-6 border-b border-border flex items-center gap-4 rounded-t-[22px]">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Transaction Details</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">Receipt: AMH-REC-{p.id}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 text-xs">
                  {/* Payer and Student Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl space-y-1">
                      <span className="font-bold text-[9px] uppercase tracking-wider text-muted-foreground block">Payer Info</span>
                      <p className="font-semibold text-foreground">{parent ? parent.full_name : "N/A"}</p>
                      <p className="text-muted-foreground">{parent ? parent.email : "N/A"}</p>
                      <p className="text-muted-foreground">{parent ? parent.phone : "N/A"}</p>
                    </div>
                    <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl space-y-1">
                      <span className="font-bold text-[9px] uppercase tracking-wider text-muted-foreground block">Student Details</span>
                      <p className="font-semibold text-foreground">{studentName}</p>
                      <p className="text-muted-foreground font-mono text-[10px]">Adm: {student ? student.admission_number : "N/A"}</p>
                      <p className="text-muted-foreground">Class: {student ? student.class_name : "N/A"}</p>
                    </div>
                  </div>

                  {/* Fee Due breakdown */}
                  {due && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Billed Installment Structure</h4>
                      <div className="space-y-2 bg-muted/20 border border-border/40 p-4 rounded-2xl">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fee Installment:</span>
                          <span className="font-semibold text-foreground">{due.due_title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tuition Fee component:</span>
                          <span className="font-medium text-foreground">₹{parseFloat(due.tuition_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                        {parseFloat(due.resource_fee) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Resource Fee component:</span>
                            <span className="font-medium text-foreground">₹{parseFloat(due.resource_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        {parseFloat(due.admission_fee || "0") > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Admission Fee component:</span>
                            <span className="font-medium text-foreground">₹{parseFloat(due.admission_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        {parseFloat(due.discount_applied) > 0 && (
                          <div className="flex justify-between text-emerald-600 font-medium">
                            <span>Discount Applied:</span>
                            <span>-₹{parseFloat(due.discount_applied).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-foreground text-xs mt-1">
                          <span>Net Billed Amount:</span>
                          <span>₹{parseFloat(due.final_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Transaction Settlement Allocation</h4>
                    <div className="space-y-2.5 bg-card border border-border/50 p-4 rounded-2xl">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tuition Cleared (This payment):</span>
                        <span className="font-semibold text-foreground">₹{base.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                      {charges > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Convenience Charges (2%):</span>
                            <span className="font-medium text-foreground">₹{charges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GST on Gateway Charges (18%):</span>
                            <span className="font-medium text-foreground">₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between border-t border-border/60 pt-2.5 font-bold text-primary text-sm mt-1">
                        <span>Actual Amount Paid:</span>
                        <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                        <span>Method: <strong className="uppercase">{p.payment_mode.replace("_", " ")}</strong></span>
                        <span>Gateway ID: <strong className="font-mono">{p.gateway_payment_id || "Desk Receipt"}</strong></span>
                      </div>
                      {p.remarks && (
                        <div className="text-[10px] text-muted-foreground bg-muted/40 p-2 rounded-lg italic">
                          Remarks: {p.remarks}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-muted/20 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => handlePrintReceipt(p)}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-all"
                  >
                    Download Printable Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentForDetails(null)}
                    className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:shadow-md transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
