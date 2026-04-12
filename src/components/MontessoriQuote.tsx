import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import mariaMontessori from "@/assets/maria-montessori.jpg";

export default function MontessoriQuote() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="reveal-fade-up bg-primary/10 border border-primary/15 rounded-3xl p-8 md:p-10 flex flex-col sm:flex-row items-center gap-6 backdrop-blur-sm"
        >
          <img
            src={mariaMontessori}
            alt="Dr. Maria Montessori"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover object-top border-4 border-primary/20 shadow-md shrink-0"
            loading="lazy"
            width={112}
            height={112}
          />
          <div className="text-center sm:text-left">
            <blockquote className="text-lg md:text-xl font-medium italic text-foreground/85 leading-relaxed mb-3">
              "Free the child's potential, and you will transform him into the world."
            </blockquote>
            <cite className="text-sm font-semibold text-primary not-italic">
              — Dr. Maria Montessori
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
}
