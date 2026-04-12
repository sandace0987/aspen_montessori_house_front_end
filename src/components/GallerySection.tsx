import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getGalleryImages } from "@/lib/gallery-utils";

export default function GallerySection() {
  const allImages = getGalleryImages();
  const previewImages = allImages.slice(0, 5);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal-fade-up text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Life at Aspen</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Glimpses of joy, discovery, and growth in our classrooms.
          </p>
        </div>

        <div ref={gridRef} className="reveal-scale-in grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {previewImages.map((img, i) => (
            <div
              key={`${img.alt}-${i}`}
              className={`rounded-2xl md:rounded-3xl overflow-hidden reveal-delay-${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-40 sm:h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: "center 25%" }}
                loading="lazy"
              />
            </div>
          ))}

          {/* CTA tile */}
          <div className="rounded-2xl md:rounded-3xl overflow-hidden reveal-delay-5">
            <Link
              to="/gallery"
              className="flex flex-col items-center justify-center gap-2 w-full h-40 sm:h-48 md:h-56 bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <span className="text-primary text-base md:text-lg font-semibold tracking-wide">See More</span>
              <ArrowRight size={22} className="text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
