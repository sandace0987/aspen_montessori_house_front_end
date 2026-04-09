import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/animations";
import m1 from "@/assets/program-m1.jpg";
import m2 from "@/assets/program-m2.jpg";
import m3 from "@/assets/program-m3.jpg";
import daycare from "@/assets/program-daycare.jpg";

const programs = [
  {
    title: "Montessori 1",
    age: "3 – 4 years",
    desc: "Building foundations through hands-on Montessori materials.",
    img: m1,
    bg: "bg-primary/10",
  },
  {
    title: "Montessori 2",
    age: "4 – 5 years",
    desc: "Developing independence and critical thinking through advanced activities.",
    img: m2,
    bg: "bg-secondary/20",
  },
  {
    title: "Montessori 3",
    age: "5+ years",
    desc: "Preparing confident, independent learners for formal school.",
    img: m3,
    bg: "bg-secondary/20",
  },
  {
    title: "Daycare",
    age: "1.5 – 6 years",
    desc: "Extended care with learning activities in a safe, joyful space.",
    img: daycare,
    bg: "bg-accent/10",
  },
];

export default function ProgramsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Programs For Every Age</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From early learning to preschool — our programs grow with your child.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring" as const, duration: 0.8, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`${p.bg} rounded-3xl p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer`}
            >
              <div className="rounded-2xl overflow-hidden mb-4">
                <img src={p.img} alt={p.title} className="w-full h-48 object-cover" loading="lazy" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
              <p className="text-xs font-medium text-primary mb-2">{p.age}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
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
