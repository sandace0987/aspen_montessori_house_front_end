import { ArrowUpRight, Leaf } from "lucide-react";
import heroPoster from "@/assets/hero-video-poster.jpg";
import { ADMISSIONS_FORM_URL } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="py-8 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* School Name */}
        <div className="animate-hero-badge mb-8 md:mb-10 flex items-center justify-center">
          <div className="group inline-flex items-center gap-2.5 cursor-default select-none">
            <Leaf size={18} className="text-primary/60 group-hover:text-primary group-hover:rotate-12 transition-all duration-500" />
            <span className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-foreground/70 group-hover:text-foreground transition-colors duration-500">
              Aspen Montessori House
            </span>
            <Leaf size={18} className="text-primary/60 group-hover:text-primary group-hover:-rotate-12 transition-all duration-500 scale-x-[-1]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Card */}
          <div className="animate-hero-enter bg-primary rounded-3xl p-8 md:p-12 flex flex-col justify-center min-h-[360px]">
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
          <div className="animate-hero-enter-delay w-full rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-[360px] relative">
            <div className="absolute inset-0 animate-ken-burns">
              <img
                src={heroPoster}
                alt="Young Montessori student building a Pink Tower in a sunlit classroom"
                className="w-full h-full object-cover object-[78%_30%] sm:object-[72%_28%] md:object-[68%_30%] lg:object-[65%_35%] scale-105"
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 50vw, 100vw"
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
