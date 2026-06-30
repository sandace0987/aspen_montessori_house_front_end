import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Calendar } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import summerCampIcon from "@/assets/summer-camp-icon.png";
import craftImg from "@/assets/summer_1.jpg";
import musicImg from "@/assets/summer_2.jpg";
import scienceImg from "@/assets/summer_3.jpg";

const highlights = ["Arts & Craft", "Music", "Dance", "Science", "Yoga", "Pottery"];

export default function SummerCampSection() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const contentRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  if (!FEATURE_FLAGS.summerCampEnabled) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal-fade-up text-center mb-8">
          <img src={summerCampIcon} alt="" className="w-16 h-16 mx-auto mb-3" width={512} height={512} loading="lazy" />
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-3">
            <Sparkles size={14} className="text-muted-foreground" /> Wrapped Up for the Season!
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Summer Camp 2026</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Calendar size={16} /> April 13 – May 8, 2026
          </p>
        </div>

        <div ref={contentRef} className="reveal-fade-up grid md:grid-cols-2 gap-6 items-center">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-2xl overflow-hidden h-48 hover:scale-[1.02] transition-transform duration-300">
              <img src={craftImg} alt="Children doing arts and crafts" className="w-full h-full object-cover" style={{ objectPosition: "center 20%" }} loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden h-36 hover:scale-[1.02] transition-transform duration-300">
              <img src={musicImg} alt="Children playing music outdoors" className="w-full h-full object-cover" style={{ objectPosition: "center 25%" }} loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden h-36 hover:scale-[1.02] transition-transform duration-300">
              <img src={scienceImg} alt="Children doing science experiments" className="w-full h-full object-cover" style={{ objectPosition: "center 20%" }} loading="lazy" />
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border p-8 md:p-10 space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">A Summer of Science, Art & Fun!</h3>
            <p className="text-muted-foreground leading-relaxed">
              Arts & Craft, Music, Dance, Science Experiments, Yoga, Pottery, Story Telling and many more exciting activities await your child this summer!
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {highlights.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{t}</span>
              ))}
            </div>
            <Link to="/summer-camp" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-md transition-all">
              More Details <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
