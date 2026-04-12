import { Sun, Search, Award, Heart, Palette, Rocket } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import timelineWelcome from "@/assets/timeline-welcome.jpg";
import timelineExplore from "@/assets/timeline-explore.jpg";
import timelineConfidence from "@/assets/timeline-confidence.jpg";
import timelineSocial from "@/assets/timeline-social.jpg";
import timelineCreative from "@/assets/timeline-creative.jpg";
import timelineReady from "@/assets/timeline-ready.jpg";

const milestones = [
  { icon: Sun, title: "First Day at Aspen", desc: "A warm welcoming classroom environment where every child feels at home.", image: timelineWelcome },
  { icon: Search, title: "Exploration & Curiosity", desc: "Children explore Montessori materials and discover the joy of learning.", image: timelineExplore },
  { icon: Award, title: "Independence & Confidence", desc: "Practical life skills and self-learning build inner strength.", image: timelineConfidence },
  { icon: Heart, title: "Social Development", desc: "Friendships blossom through teamwork and community.", image: timelineSocial },
  { icon: Palette, title: "Creative Expression", desc: "Art, storytelling, and imagination come alive every day.", image: timelineCreative },
  { icon: Rocket, title: "School Readiness", desc: "Confident learners ready for the next exciting step.", image: timelineReady },
];

function TimelineMilestone({ m, i }: { m: typeof milestones[0]; i: number }) {
  const ref = useScrollReveal<HTMLDivElement>();
  const Icon = m.icon;
  const isLeft = i % 2 === 0;

  return (
    <div
      ref={ref}
      className={`reveal-fade-up relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 ${
        isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
      }`}
    >
      <div className={`flex-1 ${isLeft ? "sm:text-right" : "sm:text-left"}`}>
        <div
          className={`bg-card rounded-3xl p-5 shadow-card inline-flex items-center gap-4 max-w-lg ${
            isLeft ? "sm:ml-auto sm:flex-row-reverse" : "sm:mr-auto"
          }`}
        >
          <img src={m.image} alt={m.title} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-contain shrink-0" />
          <div className={isLeft ? "sm:text-right" : "sm:text-left"}>
            <h3 className="text-lg font-semibold mb-1">{m.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
          </div>
        </div>
      </div>
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 z-10 shadow-card">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="flex-1 hidden sm:block" />
    </div>
  );
}

export default function TimelineSection() {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal-fade-up text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Your Child's Journey at Aspen</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every step is a milestone of growth, discovery, and joy.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary/60 -translate-x-1/2 hidden sm:block" />
          <div className="space-y-12 md:space-y-16">
            {milestones.map((m, i) => (
              <TimelineMilestone key={m.title} m={m} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
