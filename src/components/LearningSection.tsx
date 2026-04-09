import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, GraduationCap, Users, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import teacherImg1 from "@/assets/teacher-child-carousel-1.jpg";
import teacherImg2 from "@/assets/teacher-child-carousel-2.jpg";

export const teacherImages = [teacherImg1, teacherImg2];

const features = [
  { icon: ShieldCheck, text: "Safe nurturing environment" },
  { icon: GraduationCap, text: "Certified Montessori teachers" },
  { icon: Users, text: "Small group learning" },
  { icon: UserCheck, text: "1:7 adult-to-children ratio" },
];

/** Reusable crossfade carousel for teacher images */
export function TeacherCarousel({ className = "h-[400px] lg:h-[500px]" }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  const preloaded = useRef(false);

  useEffect(() => {
    if (!preloaded.current) {
      teacherImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
      preloaded.current = true;
    }
  }, []);

  const next = useCallback(() => setCurrent((p) => (p + 1) % teacherImages.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + teacherImages.length) % teacherImages.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className={`rounded-3xl overflow-hidden relative group ${className}`}>
      {teacherImages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="Teacher guiding a child through Montessori activities"
          className="w-full h-full object-cover rounded-3xl absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          loading="eager"
          decoding="async"
        />
      ))}
      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white/70 hover:bg-white/35 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white/70 hover:bg-white/35 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {teacherImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white scale-110" : "bg-white/50"
            }`}
            aria-label={`Show image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LearningSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <TeacherCarousel />
          </motion.div>

          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold leading-[1.1]">
              Learning Through Discovery Every Day
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              At Aspen Montessori, we combine nurturing care and education to help children learn naturally and confidently. Our teachers cultivate curiosity, kindness, and creativity in every student.
            </p>
            <div className="space-y-4 pt-2">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/40 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground/80">{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm"
              >
                More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
