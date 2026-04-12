import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, Mail, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import aspenLogo from "@/assets/aspen-logo.png";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

const baseNavLinks = [
  { label: "Home", hash: "#home" },
  { label: "About Us", hash: "#about" },
  { label: "Programs", hash: "#programs" },
  ...(FEATURE_FLAGS.summerCampEnabled
    ? [{ label: "Summer Camp", hash: "#summer-camp", isNew: true }]
    : []),
  { label: "Gallery", hash: "#gallery" },
  { label: "Admissions", hash: "#admissions" },
  { label: "Contact", hash: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = baseNavLinks.map((l) => l.hash.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // pick the one closest to the top
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const scrollTo = (hash: string) => {
    const id = hash.replace("#", "");
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const navHeight = document.querySelector("nav")?.getBoundingClientRect().height ?? 80;
        const bannerEl = document.querySelector("[data-events-banner]");
        const bannerHeight = bannerEl ? bannerEl.getBoundingClientRect().height : 0;
        const offset = navHeight + bannerHeight + 8;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 400);
    } else {
      // Delay to let mobile menu close animation finish
      setTimeout(doScroll, 100);
    }
  };

  const handleNewsletterClick = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={aspenLogo} alt="Aspen Montessori" className="h-14 md:h-[4.5rem] w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {baseNavLinks.map((link) => {
              const isActive = activeSection === link.hash.replace("#", "") && location.pathname === "/";
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.hash)}
                  className={`relative text-sm font-medium tracking-wide transition-colors whitespace-nowrap ${isActive
                      ? "text-primary border-b-2 border-primary pb-0.5"
                      : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  {link.label}
                  {link.isNew && (
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold leading-none">
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/newsletter"
              onClick={handleNewsletterClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium tracking-wide hover:bg-primary/5 transition-all whitespace-nowrap"
            >
              <Mail size={16} />
              Newsletter
            </Link>
            <Link
              to="/parent"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:shadow-md transition-all whitespace-nowrap"
            >
              <LogIn size={16} />
              Parent Login
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-border text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              className="p-2 text-foreground"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-card border-b border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {baseNavLinks.map((link) => {
                const isActive = activeSection === link.hash.replace("#", "") && location.pathname === "/";
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.hash)}
                    className={`relative block w-full text-left px-4 py-3 rounded-2xl transition-colors font-medium ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted"
                      }`}
                  >
                    {link.label}
                    {link.isNew && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                        LIVE
                      </span>
                    )}
                  </button>
                );
              })}

              <Link
                to="/newsletter"
                onClick={handleNewsletterClick}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary/15 transition-colors font-medium"
              >
                <Mail size={16} /> Newsletter
              </Link>
              <Link
                to="/parent"
                onClick={() => setOpen(false)}
                className="block text-center mt-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium tracking-wide"
              >
                Parent Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
