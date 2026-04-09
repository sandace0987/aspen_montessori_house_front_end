import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ADMISSIONS_FORM_URL } from "@/lib/constants";
import { ArrowLeft, Clock, Users, BookOpen, Palette, Music, Globe, Flower2, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import toddlers from "@/assets/program-toddlers.jpg";
import m1 from "@/assets/program-m1.jpg";
import m2 from "@/assets/program-m2.jpg";
import m3 from "@/assets/program-m3.jpg";
import daycare from "@/assets/program-daycare.jpg";

import { fadeUp } from "@/lib/animations";

const programs = [
  {
    title: "Toddlers",
    age: "1.5 – 2.5 years",
    timing: "9:00 AM – 12:30 PM",
    img: toddlers,
    tagline: "First steps into the world of discovery",
    description: "Our Toddlers program introduces young children to a structured yet gentle learning environment. Through sensory play, music, movement, and guided exploration, children develop motor skills, early language, and social awareness while feeling safe and loved.",
    highlights: ["Sensory exploration stations", "Music and movement sessions", "Early language development", "Guided social play", "Parent orientation sessions"],
    bg: "bg-secondary/20",
  },
  {
    title: "Montessori 1",
    age: "3 – 4 years",
    timing: "9:00 AM – 12:30 PM",
    img: m1,
    tagline: "Building foundations through hands-on learning",
    description: "The Montessori 1 program immerses children in authentic Montessori materials and activities. Children work with practical life exercises, sensorial materials, and early maths and language tools — building concentration, independence, and a love for learning.",
    highlights: ["Practical life exercises", "Montessori sensorial materials", "Pre-maths & pre-reading", "Art and creative expression", "Outdoor nature exploration"],
    bg: "bg-primary/10",
  },
  {
    title: "Montessori 2",
    age: "4 – 5 years",
    timing: "9:00 AM – 12:30 PM",
    img: m2,
    tagline: "Developing independence and critical thinking",
    description: "Our Montessori 2 program deepens the Montessori experience with advanced practical life and sensorial activities, early writing, and mathematical thinking. Children build independence, problem-solving skills, and a strong sense of community.",
    highlights: ["Advanced sensorial activities", "Early writing & reading readiness", "Mathematical concepts", "Cultural awareness", "Collaborative projects"],
    bg: "bg-secondary/15",
  },
  {
    title: "Montessori 3",
    age: "5+ years",
    timing: "9:00 AM – 2:30 PM",
    img: m3,
    tagline: "Preparing confident, independent learners",
    description: "Our Montessori 3 program builds on strong foundations with advanced materials in mathematics, language, cultural studies, and science. Children develop critical thinking, reading fluency, and collaborative skills, emerging school-ready and self-assured.",
    highlights: ["Advanced Montessori materials", "Reading & writing fluency", "Mathematics & geometry", "Science experiments", "Cultural studies & geography"],
    bg: "bg-accent/10",
  },
  {
    title: "Daycare",
    age: "1.5 – 6 years",
    timing: "9:00 AM – 5:30 PM",
    img: daycare,
    tagline: "Extended care with purpose and warmth",
    description: "Our Daycare program wraps enriching learning activities around a full day of care. Children enjoy structured Montessori sessions alongside art, storytelling, outdoor play, rest time, and nutritious meals — all in a safe, joyful environment.",
    highlights: ["Full-day structured routine", "Nutritious meals & snacks", "Rest and quiet time", "Art, music & storytelling", "Indoor and outdoor play"],
    bg: "bg-primary/5",
  },
];

const enrichments = [
  { icon: Palette, label: "Art & Craft" },
  { icon: Music, label: "Music & Rhymes" },
  { icon: Globe, label: "Cultural Studies" },
  { icon: Flower2, label: "Nature & Garden" },
  { icon: BookOpen, label: "Storytelling" },
  { icon: Users, label: "Group Projects" },
];

export default function Programs() {
  usePageMeta("Programs – Aspen Montessori Hyderabad", "Explore Toddlers, Montessori 1, Montessori 2, Montessori 3 & Daycare programs at Aspen Montessori for children aged 1.5 to 6 years.");
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2">Our Programs</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Programs That Grow With Your Child</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From early exploration to school readiness — each program is carefully designed around the Montessori philosophy of child-led, hands-on learning.
          </p>
        </motion.div>

        <div className="space-y-16 mb-20">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.05 }}
              className={`${p.bg} rounded-3xl overflow-hidden`}
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                <div className="h-64 lg:h-auto">
                  <img src={p.img} alt={`${p.title} program — children aged ${p.age}`} className="w-full h-full object-cover" loading="lazy" width={600} height={400} />
                </div>
                <div className={`p-8 md:p-10 flex flex-col justify-center ${i % 2 === 1 ? "lg:order-first" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">{p.age}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} /> {p.timing}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-2">{p.title}</h2>
                  <p className="text-primary/80 font-medium text-sm mb-4">{p.tagline}</p>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">{p.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Enrichment Activities</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Beyond the Montessori curriculum, we offer enriching activities that nurture creativity and well-rounded growth.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {enrichments.map((e, i) => (
              <motion.div
                key={e.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-5 text-center hover:shadow-md transition-shadow"
              >
                <e.icon size={28} className="text-primary mx-auto mb-3" />
                <p className="text-sm font-medium">{e.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="text-center bg-primary rounded-3xl p-10 md:p-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary-foreground mb-4">
            Find the Right Program for Your Child
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-6">
            Not sure which program fits best? Visit us for a personalised tour and consultation.
          </p>
          <a
            href={ADMISSIONS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-card text-foreground font-medium tracking-wide hover:shadow-lg transition-all"
          >
            Schedule a Visit <ArrowUpRight size={18} />
          </a>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
