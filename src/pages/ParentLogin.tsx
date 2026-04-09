import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, CreditCard, CheckCircle, Download, LogOut } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";
import aspenLogo from "@/assets/aspen-logo.png";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import ComingSoonPage from "@/components/ComingSoonPage";
import { usePageMeta } from "@/hooks/use-page-meta";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, duration: 0.8 },
};

const payments = [
  { id: "INV-001", date: "Feb 2026", amount: "₹25,000", status: "Paid" },
  { id: "INV-002", date: "Jan 2026", amount: "₹25,000", status: "Paid" },
  { id: "INV-003", date: "Dec 2025", amount: "₹25,000", status: "Paid" },
];

export default function ParentLogin() {
  usePageMeta("Parent Portal – Aspen Montessori", undefined, { noindex: true });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!FEATURE_FLAGS.parentPortalEnabled) {
    return <ComingSoonPage title="Parent Portal" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (email && password) {
      setError("");
      setIsLoggedIn(true);
    } else {
      setError("Please enter email and password");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/">
              <img src={aspenLogo} alt="Aspen Montessori" className="h-20 w-auto mx-auto mb-6" />
            </Link>
            <h1 className="text-2xl font-semibold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your parent portal</p>
          </div>

          <form className="bg-card rounded-3xl p-8 shadow-card space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                placeholder="parent@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline font-medium">
              ← Back to Home
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 {...fadeUp} className="text-2xl md:text-3xl font-semibold">
            Parent Dashboard
          </motion.h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div {...fadeUp} className="bg-card rounded-3xl p-6 shadow-card md:col-span-2">
            <h2 className="font-semibold mb-4">Student Profile</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center text-2xl font-semibold text-primary">
                A
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Aanya Sharma</p>
                <p className="text-sm text-muted-foreground">Age: 4 years</p>
                <p className="text-sm text-muted-foreground">Program: Montessori 3</p>
                <p className="text-sm text-muted-foreground">Enrolled since: June 2024</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="bg-card rounded-3xl p-6 shadow-card">
            <h2 className="font-semibold mb-4">Fee Status</h2>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">March 2026</span>
            </div>
            <p className="text-2xl font-semibold text-primary mb-1">₹25,000</p>
            <p className="text-xs text-muted-foreground mb-4">Due: March 15, 2026</p>
            <button className="w-full px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:shadow-md transition-all">
              Pay Fees
            </button>
          </motion.div>
        </div>

        <motion.div {...fadeUp} className="bg-card rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Payment History</h2>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              <Download size={14} /> Download All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left pb-3 font-medium text-muted-foreground">Period</th>
                  <th className="text-left pb-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium">{p.id}</td>
                    <td className="py-3 text-muted-foreground">{p.date}</td>
                    <td className="py-3">{p.amount}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <CheckCircle size={12} /> {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
