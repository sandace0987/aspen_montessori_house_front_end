import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import aspenLogo from "@/assets/aspen-logo.png";
import { PHONE_NUMBER, EMAIL, ADDRESS_SHORT, SCHOOL_NAME, DEVELOPER_URL, INSTAGRAM_URL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center sm:text-left">
          <div>
            <img src={aspenLogo} alt="Aspen Montessori" className="h-14 w-auto mb-4 mx-auto sm:mx-0" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Empowering the absorbent minds through joyful, child-centered Montessori education in Hyderabad.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors mt-5"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-sm">Follow us</span>
            </a>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/" className="block text-muted-foreground text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-muted-foreground text-sm hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/programs" className="block text-muted-foreground text-sm hover:text-primary transition-colors">
                Programs
              </Link>
              <Link to="/gallery" className="block text-muted-foreground text-sm hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link
                to="/newsletter"
                className="block text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                Newsletter
              </Link>
              <Link to="/contact" className="block text-muted-foreground text-sm hover:text-primary transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>{ADDRESS_SHORT}</p>
              <p>{PHONE_NUMBER}</p>
              <p>{EMAIL}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4">
            <Link to="/privacy" className="text-muted-foreground text-xs hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/40 text-xs">|</span>
            <Link to="/terms" className="text-muted-foreground text-xs hover:text-primary transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-muted-foreground/40 text-xs">|</span>
            <Link to="/refund" className="text-muted-foreground text-xs hover:text-primary transition-colors">
              Cancellation &amp; Refund Policy
            </Link>
            <span className="text-muted-foreground/40 text-xs">|</span>
            <Link to="/shipping" className="text-muted-foreground text-xs hover:text-primary transition-colors">
              Shipping &amp; Delivery Policy
            </Link>
            <span className="text-muted-foreground/40 text-xs">|</span>
            <Link to="/contact" className="text-muted-foreground text-xs hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {SCHOOL_NAME}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Created with ❤️ by{" "}
            <a
              href={`mailto:${DEVELOPER_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              skb
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
