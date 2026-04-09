import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/use-page-meta";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import aspenLogo from "@/assets/aspen-logo.png";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import ComingSoonPage from "@/components/ComingSoonPage";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: GraduationCap, label: "Students", active: false },
  { icon: CreditCard, label: "Payments", active: false },
  { icon: UserCheck, label: "Parents", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const stats = [
  { label: "Total Students", value: "124", icon: Users, change: "+8 this month" },
  { label: "Active Parents", value: "98", icon: UserCheck, change: "+5 this month" },
  { label: "Revenue (Mar)", value: "₹31L", icon: DollarSign, change: "+12% from Feb" },
  { label: "New Admissions", value: "6", icon: UserPlus, change: "This quarter" },
];

const recentStudents = [
  { name: "Aanya Sharma", program: "Montessori 3", status: "Active", fee: "Paid" },
  { name: "Arjun Kumar", program: "Montessori 2", status: "Active", fee: "Pending" },
  { name: "Saanvi Reddy", program: "Montessori 1", status: "Active", fee: "Paid" },
  { name: "Vikram Patel", program: "Montessori 3", status: "Active", fee: "Paid" },
  { name: "Diya Nair", program: "Montessori 2", status: "Trial", fee: "N/A" },
];

export default function AdminDashboard() {
  usePageMeta("Admin Dashboard – Aspen Montessori", undefined, { noindex: true });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  if (!FEATURE_FLAGS.adminPortalEnabled) {
    return <ComingSoonPage title="Admin Portal" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (username && password) {
      setError("");
      setIsLoggedIn(true);
    } else {
      setError("Please enter username and password");
    }
  };

  // Login screen
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck size={22} className="text-primary" />
              <h1 className="text-2xl font-semibold">Admin Portal</h1>
            </div>
            <p className="text-muted-foreground text-sm">Sign in to manage your school</p>
          </div>

          <form className="bg-card rounded-3xl p-8 shadow-card space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium mb-1.5">Username</label>
              <input
                name="username"
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                placeholder="admin"
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
    <div className="min-h-screen bg-background flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <img src={aspenLogo} alt="Aspen Montessori" className="h-12 w-auto mb-8" />
          <nav className="space-y-1">
            {sidebarLinks.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border space-y-1">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home size={18} /> Back to Home
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-9 pr-4 py-2 rounded-xl bg-muted border-0 text-sm w-64 focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
              AD
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-semibold mb-6"
          >
            Dashboard Overview
          </motion.h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl p-5 shadow-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon size={16} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold mb-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp size={12} className="text-primary" /> {s.change}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-card"
          >
            <h2 className="font-semibold mb-4">Recent Students</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left pb-3 font-medium text-muted-foreground">Program</th>
                    <th className="text-left pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left pb-3 font-medium text-muted-foreground">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((s) => (
                    <tr key={s.name} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium">{s.name}</td>
                      <td className="py-3 text-muted-foreground">{s.program}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          s.status === "Active"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs font-medium ${
                          s.fee === "Paid" ? "text-primary" : s.fee === "Pending" ? "text-accent" : "text-muted-foreground"
                        }`}>
                          {s.fee}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
