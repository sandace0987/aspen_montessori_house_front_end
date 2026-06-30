import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, Sun, Moon, Shield } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/context/AuthContext";
import aspenLogo from "@/assets/aspen-logo.png";

interface DashboardNavbarProps {
  showLogout?: boolean;
}

export default function DashboardNavbar({ showLogout = true }: DashboardNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout, roles } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const isCurrentlyAdmin = window.location.pathname.startsWith("/admin");
    await logout();
    navigate(isCurrentlyAdmin ? "/admin" : "/parent");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="shrink-0">
            <img src={aspenLogo} alt="Aspen Montessori" className="h-10 md:h-12 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            {roles.includes("admin") && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <Shield size={16} />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {showLogout && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
