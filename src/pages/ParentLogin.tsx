import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  CreditCard,
  CheckCircle,
  Download,
  LogOut,
  User,
  Calendar,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Check,
  Database,
  Printer,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  Lock
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";
import aspenLogo from "@/assets/aspen-logo.png";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import ComingSoonPage from "@/components/ComingSoonPage";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useAuth } from "@/context/AuthContext";
import { api, StudentResponse, FeeDueResponse, PaymentResponse } from "@/apis/api-client";
import { toast } from "sonner";

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, duration: 0.5 },
};

export default function ParentLogin() {
  usePageMeta("Parent Portal – Aspen Montessori", undefined, { noindex: true });

  const {
    user,
    roles,
    token,
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout
  } = useAuth();

  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Dashboard dynamic states
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [dues, setDues] = useState<FeeDueResponse[]>([]);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState("0.00");
  const [dataLoading, setDataLoading] = useState(false);

  // Razorpay payment flow states
  const [isPaying, setIsPaying] = useState<number | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentResponse | null>(null);
  const [showFutureInstallments, setShowFutureInstallments] = useState(false);

  const isFutureDue = (dueDateStr: string) => {
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate.getTime() > today.getTime();
  };

  const visibleDues = showFutureInstallments
    ? dues
    : dues.filter((due) => !isFutureDue(due.due_date) || due.status === "paid");

  // School calendar events definition
  const schoolEvents = [
    {
      date: "2026-08-15",
      title: "Independence Day Celebration",
      description: "Flag hoisting ceremony, cultural activities, and student performances.",
    },
    {
      date: "2026-08-31",
      title: "Dr. Maria Montessori's Birthday",
      description: "Hands-on learning showcases celebrating Montessori pedagogy.",
    },
    {
      date: "2026-09-05",
      title: "Teacher's Day Celebration",
      description: "Special honoring programs organized for our educators.",
    },
    {
      date: "2026-10-02",
      title: "Gandhi Jayanti",
      description: "Day observance",
    },
    {
      date: "2026-11-14",
      title: "Children's Day Carnival",
      description: "Games, food stalls, and creative workshops for children.",
    }
  ];

  const upcomingEvents = schoolEvents
    .filter((e) => {
      const eventDate = new Date(e.date);
      eventDate.setHours(23, 59, 59, 999);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate.getTime() >= today.getTime();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
    return { day, month };
  };

  // Load dashboard data once authenticated
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    try {
      const summary = await api.getParentDashboard();
      setStudents(summary.students);
      const sortedDues = [...summary.dues].sort(
        (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      );
      setDues(sortedDues);
      setPayments(summary.recent_payments);
      setTotalOutstanding(summary.total_outstanding);
    } catch (err: any) {
      console.error("Failed to load parent dashboard parameters", err);
      toast.error("Error synchronizing dashboard datasets.");
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
      const hasParent = roles.includes("parent");
      if (hasAdmin && !hasParent) {
        logout();
        setError("Access Denied: This account is an Admin account. Please log in through the Admin Portal.");
      } else {
        fetchDashboardData();
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

  if (!FEATURE_FLAGS.parentPortalEnabled) {
    return <ComingSoonPage title="Parent Portal" />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-muted-foreground animate-pulse">Loading family portal...</p>
        </div>
      </div>
    );
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setError("Please enter your email");
      return;
    }

    let email = emailInput.trim();
    if (!email.includes("@")) {
      email = email + "@gmail.com";
      setEmailInput(email);
    }

    if (!passwordInput) {
      setError("Please enter your password");
      return;
    }
    setError("");
    setLoginLoading(true);

    const success = await login(email, passwordInput);
    setLoginLoading(false);
    if (!success) {
      setError("Authentication failed. Please check your email and password.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setForgotLoading(true);
    setForgotSuccess(false);

    try {
      await api.forgotPassword(forgotEmail.trim());
      setForgotSuccess(true);
      setForgotEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to trigger password reset");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter (capital)");
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError("Password must contain at least one special character (e.g. !, @, #, $, etc.)");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
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
      navigate("/parent", { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setResetLoading(false);
    }
  };

  // Razorpay SDK dynamic script injector
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayFee = async (due: FeeDueResponse) => {
    setIsPaying(due.id);
    try {
      const balanceVal = parseFloat(due.balance);

      // 1. Create order on gateway (calls parent/payment-intent backend)
      const order = await api.createPaymentIntent({
        fee_due_id: due.id,
        amount: balanceVal,
        remarks: `Paying tuition & resource fees for ${due.due_title}`
      });

      // 2. Instantiate Razorpay Checkout SDK Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK script failed to load. Are you connected to the internet?");
        setIsPaying(null);
        return;
      }

      // 3. Mount Razorpay Checkout Widget
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Aspen Montessori House",
        description: due.due_title,
        order_id: order.order_id,
        image: aspenLogo,
        handler: async function (response: any) {
          // Cryptographic confirmation payload
          try {
            toast.loading("Verifying gateway signature with backend...", { id: "verify-toast" });
            const verification = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment verified successfully!", { id: "verify-toast" });
            setPaymentSuccess(verification);
            fetchDashboardData();
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed.", { id: "verify-toast" });
          }
        },
        prefill: {
          name: user?.full_name || "Jane Doe",
          email: user?.email || "jane.doe@example.com",
          contact: user?.phone || "+919876543210"
        },
        theme: {
          color: "#D97706" // Warm amber brand accent
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment gateway order.");
    } finally {
      setIsPaying(null);
    }
  };

  const handlePrintReceipt = (payment: PaymentResponse) => {
    const studentName = students.find(s => s.id === payment.student_id)?.student_name || "Student";
    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) return;

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Receipt - Aspen Montessori House</title>
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
              <strong>Parent Name:</strong> ${user?.full_name}<br/>
              <strong>Email:</strong> ${user?.email}<br/>
              <strong>Phone:</strong> ${user?.phone}
            </div>
            <div class="box">
              <strong style="display:block; margin-bottom:8px; color:#475569;">Transaction Details</strong>
              <strong>Receipt No:</strong> AMH-REC-${payment.id}<br/>
              <strong>Payment ID:</strong> ${payment.gateway_payment_id || "Desk manual"}<br/>
              <strong>Date:</strong> ${new Date(payment.paid_at).toLocaleString()}<br/>
              <strong>Payment Mode:</strong> ${payment.payment_mode.replace("_", " ")}
            </div>
          </div>
          <div class="section">
            <strong>Student Account:</strong> ${studentName}
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Montessori Fee Installment Clearance</td>
                  <td style="text-align: right; font-weight: 600;">₹${parseFloat(payment.amount_paid).toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
            <div class="total">Total Received: ₹${parseFloat(payment.amount_paid).toLocaleString("en-IN")}</div>
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

  // Sign-in Portal Interface
  // Reset Password Portal Interface
  if (isResetMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row items-stretch">
        <div className="hidden md:flex md:w-1/2 bg-amber-50 dark:bg-amber-950/20 items-center justify-center p-12 relative overflow-hidden border-r border-border">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="max-w-md text-center space-y-6 z-10">
            <img src={aspenLogo} alt="Aspen Montessori" className="h-32 w-auto mx-auto drop-shadow-xl" />
            <h2 className="text-3xl font-semibold tracking-tight text-amber-900 dark:text-amber-100">
              Aspen Family Portal
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track student profiles, review academic schedules, access quarterly resource schedules, and process online transactions securely with Razorpay checkout integration.
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
              <p className="text-muted-foreground text-sm">Create a new secure password for your account</p>
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

              {error && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {error}</p>}

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:flex-row items-stretch">
        <div className="hidden md:flex md:w-1/2 bg-amber-50 dark:bg-amber-950/20 items-center justify-center p-12 relative overflow-hidden border-r border-border">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="max-w-md text-center space-y-6 z-10">
            <img src={aspenLogo} alt="Aspen Montessori" className="h-32 w-auto mx-auto drop-shadow-xl" />
            <h2 className="text-3xl font-semibold tracking-tight text-amber-900 dark:text-amber-100">
              Aspen Family Portal
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track student profiles, review academic schedules, access quarterly resource schedules, and process online transactions securely with Razorpay checkout integration.
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
                {isForgotPassword ? "Reset Password" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isForgotPassword ? "Get instructions sent to your email to set a new password" : "Sign in to your parent dashboard account"}
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
                    placeholder="parent@email.com"
                  />
                </div>

                {error && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {error}</p>}
                {forgotSuccess && <p className="text-sm text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle size={14} /> Password reset link sent to your email!</p>}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  {forgotLoading && <RefreshCw className="animate-spin" size={16} />}
                  Send Reset Link
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError("");
                      setForgotSuccess(false);
                    }}
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    Back to Sign In
                  </button>
                </p>
              </form>
            ) : (
              <>


                <form className="space-y-5" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email Address</label>
                    <input
                      name="email"
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                      placeholder="parent@email.com"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["@gmail.com", "@outlook.com", "@yahoo.com", "@icloud.com"].map((ext) => (
                        <button
                          key={ext}
                          type="button"
                          onClick={() => {
                            const atIndex = emailInput.indexOf("@");
                            if (atIndex !== -1) {
                              setEmailInput(emailInput.slice(0, atIndex) + ext);
                            } else {
                              setEmailInput(emailInput + ext);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${emailInput.endsWith(ext)
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
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-medium text-muted-foreground">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError("");
                          setForgotSuccess(false);
                        }}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
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

                  {error && <p className="text-sm text-destructive font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {error}</p>}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {loginLoading && <RefreshCw className="animate-spin" size={16} />}
                    Sign In
                  </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                    ← Back to Home
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Dashboard Interface
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
          <div>
            <span className="text-xs font-semibold text-primary tracking-wider uppercase">Active Parent Profile</span>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              Welcome, {user?.full_name || "Jane Doe"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Logged in with parent credentials</p>
          </div>
        </div>

        {/* Dynamic Success Dialog */}
        <AnimatePresence>
          {paymentSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Check size={28} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">Fee Payment Successful</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    Your payment of ₹{parseFloat(paymentSuccess.amount_paid).toLocaleString("en-IN")} has been captured and validated cryptographically.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                <button
                  onClick={() => handlePrintReceipt(paymentSuccess)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium text-sm transition-all"
                >
                  <Printer size={16} /> Print Confirmation
                </button>
                <button
                  onClick={() => setPaymentSuccess(null)}
                  className="px-4 py-2 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 rounded-full font-medium text-sm hover:bg-emerald-500/10 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Linked Student profiles */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <User size={18} className="text-primary" /> Active Student Profiles
            </h2>

            {dataLoading ? (
              <div className="bg-card rounded-3xl p-12 text-center border border-border flex flex-col items-center justify-center gap-3">
                <RefreshCw className="animate-spin text-primary" size={24} />
                <p className="text-sm text-muted-foreground">Synchronizing student records...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="bg-card rounded-3xl p-8 text-center border border-border space-y-3">
                <p className="text-muted-foreground text-sm">No student profile matches found linked to your email.</p>
                <p className="text-xs text-muted-foreground">Administrators must bind your parent ID to active student entries.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {students.map((student) => (
                  <motion.div
                    key={student.id}
                    {...fadeUp}
                    className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                        {student.student_name[0]}
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate" title={student.student_name}>{student.student_name}</p>
                        <p className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full inline-block font-mono">
                          Adm: {student.admission_number}
                        </p>
                        <div className="space-y-1 pt-2 border-t border-border/80 mt-2 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1.5"><Calendar size={12} /> Born: {student.date_of_birth}</p>
                          <p className="flex items-center gap-1.5"><BookOpen size={12} /> Class: {student.class_name}</p>
                          {student.discount_value && parseFloat(student.discount_value as string) > 0 && (
                            <p className="flex items-center gap-1.5 text-emerald-600 font-medium">
                              <TrendingDown size={12} /> Discount: {student.discount_value} {student.discount_type === "percentage" ? "%" : "INR"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Fee stats outstanding summary */}
          <div className="space-y-6">
            {/* Upcoming Important Dates */}
            <motion.div
              {...fadeUp}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-primary" /> Upcoming Important Dates
              </h3>
              {upcomingEvents.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <p className="text-xs font-semibold text-foreground">Stay tuned for updates!</p>
                  <p className="text-[10px] text-muted-foreground/80">Check back later for school calendar and event details.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event, idx) => {
                    const { day, month } = formatEventDate(event.date);
                    return (
                      <div key={idx} className="flex gap-3 items-center p-2 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/30">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-bold text-primary leading-none tracking-wider">{month}</span>
                          <span className="text-sm font-bold text-foreground leading-none mt-0.5">{day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-foreground truncate" title={event.title}>{event.title}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CreditCard size={18} className="text-primary" /> Fee Account Dues
            </h2>
            <motion.div
              {...fadeUp}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-4xl font-semibold text-primary mt-2">₹{parseFloat(totalOutstanding).toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground mt-2">Aggregated balance of all open term dues</p>
              </div>

              <div className="border-t border-border/80 my-5 pt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Number of pending terms:</span>
                  <span className="font-semibold text-foreground">
                    {dues.filter(d => d.status !== "paid").length} installment(s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Secure processor:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    Razorpay Gateway
                  </span>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-2xl flex items-start gap-2.5 text-xs text-muted-foreground">
                <AlertCircle className="shrink-0 text-primary mt-0.5" size={14} />
                <p>Transactions are processed via high-grade TLS encryption directly to Razorpay servers. Dues reconciliation is immediate.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Detailed Due Cards */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" /> Installment Dues Breakdown
            </h2>
            <div className="flex items-center gap-2 bg-muted/50 border border-border/60 rounded-xl px-3 py-1.5 self-start sm:self-auto">
              <label htmlFor="show-future-toggle" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                Show future installments
              </label>
              <button
                id="show-future-toggle"
                type="button"
                onClick={() => setShowFutureInstallments(!showFutureInstallments)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showFutureInstallments ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${showFutureInstallments ? "translate-x-4" : "translate-x-0"
                    }`}
                />
              </button>
            </div>
          </div>

          {dataLoading ? (
            <div className="bg-card rounded-3xl p-12 border border-border text-center">
              <RefreshCw className="animate-spin text-primary mx-auto mb-2" size={20} />
              <p className="text-sm text-muted-foreground">Reconciling outstanding ledgers...</p>
            </div>
          ) : visibleDues.length === 0 ? (
            <div className="bg-card rounded-3xl p-12 border border-border text-center text-muted-foreground text-sm">
              {dues.length > 0
                ? "No current outstanding dues found. Turn on the toggle above to view future term installments."
                : "No outstanding dues are currently registered for linked student fee accounts."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleDues.map((due) => {
                const studentName = students.find((s) => s.id === due.student_id)?.student_name || "Student";
                const isPaid = due.status === "paid";
                const isPartial = due.status === "partial";
                const isOverdue = due.status === "overdue";

                // Check if a subsequent term is disabled because a prior term is unpaid
                const getTermOrder = (d: FeeDueResponse): number => {
                  const match = d.due_title.match(/Term\s*(\d+)/i);
                  return match ? parseInt(match[1], 10) : new Date(d.due_date).getTime();
                };

                const currentTermOrder = getTermOrder(due);
                const hasUnpaidPriorTerm = dues.some((d) => {
                  if (d.student_id !== due.student_id) return false;
                  if (d.id === due.id) return false;
                  const siblingTermOrder = getTermOrder(d);
                  return siblingTermOrder < currentTermOrder && d.status !== "paid";
                });

                return (
                  <motion.div
                    key={due.id}
                    {...fadeUp}
                    className={`bg-card border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all ${isPaid
                      ? "border-emerald-500/20 bg-emerald-500/[0.01]"
                      : isOverdue
                        ? "border-rose-500/20 bg-rose-500/[0.01]"
                        : "border-border"
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-muted-foreground tracking-tight max-w-[60%] truncate" title={studentName}>
                          {studentName}
                        </span>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${isPaid
                          ? "bg-emerald-500/10 text-emerald-700"
                          : isPartial
                            ? "bg-amber-500/10 text-amber-700"
                            : isOverdue
                              ? "bg-rose-500/10 text-rose-700"
                              : "bg-blue-500/10 text-blue-700"
                          }`}>
                          {due.status}
                        </span>
                      </div>

                      <h4 className="font-semibold text-foreground text-sm md:text-base mb-4 line-clamp-1" title={due.due_title}>{due.due_title}</h4>

                      <div className="space-y-2 mb-6 text-xs border-b border-border/60 pb-4">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Tuition Fee:</span>
                          <span className="font-medium text-foreground">₹{parseFloat(due.tuition_fee).toLocaleString()}</span>
                        </div>
                        {parseFloat(due.resource_fee) > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Resource Fee:</span>
                            <span className="font-medium text-foreground">₹{parseFloat(due.resource_fee).toLocaleString()}</span>
                          </div>
                        )}
                        {parseFloat(due.discount_applied) > 0 && (
                          <div className="flex justify-between text-emerald-600 font-medium">
                            <span>Discount Applied:</span>
                            <span>-₹{parseFloat(due.discount_applied).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold border-t border-dashed border-border pt-2 text-foreground">
                          <span>Final Amount:</span>
                          <span>₹{parseFloat(due.final_amount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Paid: ₹{parseFloat(due.paid_amount).toLocaleString()}</span>
                        <span className="font-semibold text-foreground">Balance: ₹{parseFloat(due.balance).toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <strong>Due Date:</strong> {due.due_date}
                      </div>

                      {!isPaid ? (
                        <button
                          onClick={() => handlePayFee(due)}
                          disabled={isPaying === due.id || hasUnpaidPriorTerm}
                          className={`w-full py-2.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${hasUnpaidPriorTerm
                            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60 border border-border"
                            : "bg-primary text-primary-foreground hover:shadow-md"
                            }`}
                        >
                          {isPaying === due.id ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>Interfacing Gateway...</span>
                            </>
                          ) : hasUnpaidPriorTerm ? (
                            <>
                              <Lock size={14} className="text-muted-foreground" />
                              <span>Pay Prior Terms First</span>
                            </>
                          ) : (
                            <>
                              <CreditCard size={14} />
                              <span>Pay ₹{parseFloat(due.balance).toLocaleString("en-IN")}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="py-2 rounded-full bg-emerald-500/10 text-emerald-700 text-center text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/15">
                          <CheckCircle size={14} /> Fully Paid
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Historical Payments Table */}
        <motion.div {...fadeUp} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/80">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Historical Payment Records</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Summary of settled statements and manual cash receipts</p>
            </div>
          </div>

          {dataLoading ? (
            <div className="py-10 text-center">
              <RefreshCw className="animate-spin text-primary mx-auto mb-2" size={18} />
              <p className="text-sm text-muted-foreground">Fetching transaction transcripts...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              No historical transactions are logged on this account yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-[11px] font-semibold uppercase tracking-wider text-left">
                    <th className="pb-3 font-semibold">Receipt</th>
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Payment Mode</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const studentName = students.find((s) => s.id === p.student_id)?.student_name || "Student";
                    const isSuccess = p.status === "success";

                    return (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-4 font-semibold text-foreground">AMH-REC-{p.id}</td>
                        <td className="py-4 text-muted-foreground">{studentName}</td>
                        <td className="py-4 text-muted-foreground">
                          {new Date(p.paid_at || p.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 font-semibold text-foreground">₹{parseFloat(p.amount_paid).toLocaleString("en-IN")}</td>
                        <td className="py-4 text-muted-foreground">
                          <span className="capitalize">{p.payment_mode.replace("_", " ")}</span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${isSuccess
                            ? "bg-emerald-500/10 text-emerald-700"
                            : p.status === "pending"
                              ? "bg-amber-500/10 text-amber-700"
                              : "bg-rose-500/10 text-rose-700"
                            }`}>
                            {isSuccess && <CheckCircle size={10} />}
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {isSuccess && (
                            <button
                              onClick={() => handlePrintReceipt(p)}
                              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-all"
                            >
                              <Download size={12} /> Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
