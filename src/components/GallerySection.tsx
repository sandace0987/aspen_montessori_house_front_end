import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getGalleryImages } from "@/lib/gallery-utils";

export default function GallerySection() {
  const allImages = getGalleryImages();
  // Show first 5 images + CTA tile = 2 rows of 3
  const previewImages = allImages.slice(0, 5);

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring" as const, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Life at Aspen</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Glimpses of joy, discovery, and growth in our classrooms.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {previewImages.map((img, i) => (
            <motion.div
              key={`${img.alt}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring" as const, duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl md:rounded-3xl overflow-hidden"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-40 sm:h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ))}

          {/* CTA tile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring" as const, duration: 0.6, delay: 0.4 }}
            className="rounded-2xl md:rounded-3xl overflow-hidden"
          >
            <Link
              to="/gallery"
              className="flex flex-col items-center justify-center gap-2 w-full h-40 sm:h-48 md:h-56 bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <span className="text-primary text-base md:text-lg font-semibold tracking-wide">See More</span>
              <ArrowRight size={22} className="text-primary" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
