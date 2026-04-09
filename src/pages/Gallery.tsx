import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGalleryImages } from "@/lib/gallery-utils";

export default function Gallery() {
  const allImages = getGalleryImages();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
            Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Moments of joy, creativity, and discovery at Aspen Montessori.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allImages.map((img, i) => (
            <motion.div
              key={`${img.alt}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={400}
                height={256}
              />
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
