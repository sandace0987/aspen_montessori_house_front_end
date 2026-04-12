import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import toddlers from "@/assets/program-toddlers.jpg";
import prePrimary from "@/assets/program-m1.jpg";
import daycare from "@/assets/program-daycare.jpg";

const programs = [
  {
    title: "Toddlers",
    age: "1.5 – 2.5 years",
    desc: "Sensory exploration and early independence in a safe, nurturing environment.",
    img: toddlers,
    bg: "bg-secondary/20",
    objectPos: "center 30%",
  },
  {
    title: "Pre-Primary",
    age: "3 – 5+ years",
    desc: "Building foundations through hands-on Montessori materials — from early exploration to school readiness.",
    img: prePrimary,
    bg: "bg-primary/10",
    objectPos: "center 25%",
  },
  {
    title: "Daycare",
    age: "1.5 – 6 years",
    desc: "Extended care with learning activities in a safe, joyful space.",
    img: daycare,
    bg: "bg-accent/10",
    objectPos: "center top",
  },
];

export default function ProgramsSection() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal-fade-up text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Explore Our Programs</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From early learning to preschool — our programs grow with your child.
          </p>
        </div>

        <div ref={gridRef} className="reveal-fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <div
              key={p.title}
              className={`${p.bg} rounded-3xl p-4 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer reveal-delay-${i + 1}`}
            >
              <div className="rounded-2xl overflow-hidden mb-4">
                <img src={p.img} alt={p.title} className="w-full h-48 object-cover" style={{ objectPosition: p.objectPos }} loading="lazy" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
              <p className="text-xs font-medium text-primary mb-2">{p.age}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/programs"
            className="inline-flex items-center px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm"
          >
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
