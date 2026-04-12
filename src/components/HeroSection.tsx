import { ArrowUpRight } from "lucide-react";
import heroPoster from "@/assets/hero-video-poster.jpg";
import { ADMISSIONS_FORM_URL } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="py-8 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Card */}
          <div className="animate-hero-enter bg-primary rounded-3xl p-8 md:p-12 flex flex-col justify-center min-h-[360px]">
            <span className="animate-hero-badge inline-flex px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground text-xs font-bold tracking-[0.15em] uppercase mb-3 drop-shadow-sm w-auto self-start">
              Aspen Montessori House
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-4">
              Where Learning Begins With Joy
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg mb-8 leading-relaxed">
              A nurturing Montessori environment where children discover, explore, and grow at their own pace.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-foreground text-primary font-medium hover:shadow-lg transition-all"
              >
                Explore Programs <ArrowUpRight size={18} />
              </button>
              <a
                href={ADMISSIONS_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:shadow-lg transition-all"
              >
                Book a Visit <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          {/* Right Cinematic Video */}
          <div className="animate-hero-enter-delay rounded-3xl overflow-hidden min-h-[360px] relative">
            <div className="absolute inset-0 animate-ken-burns">
              <img
                src={heroPoster}
                alt="Children learning in a warm sunlit Montessori classroom"
                className="w-full h-full object-cover scale-110"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            {/* Cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
