import { CalendarCheck, FileText, Users, GraduationCap } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ADMISSIONS_FORM_URL } from "@/lib/constants";

const steps = [
  { icon: CalendarCheck, title: "Schedule a Visit", desc: "Tour our campus, explore our classrooms, and experience the Montessori environment first-hand." },
  { icon: FileText, title: "Submit Application", desc: "Fill out our simple application form with your child's details and preferred program." },
  { icon: Users, title: "Meet & Interact", desc: "Your child spends a trial session with our guides so we can understand their unique needs." },
  { icon: GraduationCap, title: "Welcome to Aspen", desc: "Receive your admission letter and begin the onboarding journey into our Montessori community." },
];

export default function AdmissionsCTA() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal-fade-up text-center mb-14">
          <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/60 mb-2">Admissions</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">Begin Your Child's Journey Today</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Visit our campus, meet our teachers, and discover why families across Hyderabad trust Aspen Montessori.
          </p>
        </div>

        <div ref={gridRef} className="reveal-fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step, i) => (
            <div key={step.title} className={`bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center reveal-delay-${i + 1}`}>
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/15 flex items-center justify-center mx-auto mb-4">
                <step.icon size={24} className="text-primary-foreground" />
              </div>
              <p className="text-xs font-bold text-primary-foreground/50 uppercase tracking-wider mb-1">Step {i + 1}</p>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={ADMISSIONS_FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-card text-foreground font-medium tracking-wide hover:shadow-lg transition-all">
            Schedule a Visit
          </a>
          <a href={ADMISSIONS_FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-primary-foreground/30 text-primary-foreground font-medium tracking-wide hover:bg-primary-foreground/10 transition-all">
            Apply for Admission
          </a>
        </div>
      </div>
    </section>
  );
}
