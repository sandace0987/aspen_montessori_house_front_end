import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import comingSoonImg from "@/assets/coming-soon.jpg";

interface ComingSoonPageProps {
  title: string;
  backTo?: string;
  backLabel?: string;
}

export default function ComingSoonPage({ title, backTo = "/", backLabel = "Back to Home" }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" as const, duration: 0.8 }}
        className="max-w-md w-full"
      >
        <img
          src={comingSoonImg}
          alt="Building something awesome"
          className="w-40 h-40 mx-auto mb-8"
          width={512}
          height={512}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mb-2">
          We're building something awesome! 🚀
        </p>
        <p className="text-muted-foreground text-sm mb-8">
          This section is coming soon. Stay tuned for updates.
        </p>
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
        >
          <ArrowLeft size={16} /> {backLabel}
        </Link>
      </motion.div>
    </div>
  );
}
