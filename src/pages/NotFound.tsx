import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, TreePine } from "lucide-react";
import aspenLogo from "@/assets/aspen-logo.png";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <Link to="/" className="inline-block mb-8">
          <img src={aspenLogo} alt="Aspen Montessori logo" className="h-16 w-auto mx-auto" width={64} height={64} />
        </Link>

        <div className="flex items-center justify-center gap-3 mb-6 text-primary/30">
          <TreePine size={32} />
          <TreePine size={48} />
          <TreePine size={28} />
        </div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-7xl font-bold text-primary mb-3"
        >
          404
        </motion.h1>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          Oops! This trail doesn't exist
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          It seems you've wandered off the path. Let's guide you back to
          familiar ground.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground/70 font-medium hover:bg-muted transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
