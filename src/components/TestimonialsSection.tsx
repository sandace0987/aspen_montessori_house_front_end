import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "It's been a wonderful journey with Aspen. It feels like home — no pressure, kids have mats, no TV. They teach at the pace of the child. The Montessori way, friendly atmosphere, and happy kids attracted us the most. Vani ma'am and Jyothi ma'am take utmost care and you can feel their constant urge to do better.",
    parent: "Soumya",
    child: "Mother of Mihira, age 6 & Neel, age 4",
  },
  {
    quote:
      "The school provides a warm, nurturing environment where children feel safe and encouraged to explore at their own pace. The curriculum promotes not just academics but independence, creativity, and confidence. I've seen a wonderful transformation in my daughter's communication and social skills.",
    parent: "Sandhya Molakala",
    child: "Mother of Kiyara, age 6",
  },
  {
    quote:
      "Enrolling our daughter at Aspen was one of our best decisions. The independence and self-management she’s developed truly stand out, along with her neat, confident handwriting. She approaches new things with curiosity and a quiet confidence we didn’t teach her; Aspen did. Special thanks to Teacher Jyothi and Teacher Vaani, who are truly the pillars of the school.",
    parent: "Harika",
    child: "Mother of Ridhima, age 5",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring" as const, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">What Parents Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Trusted by families across Hyderabad.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.parent}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring" as const, duration: 0.8, delay: i * 0.1 }}
              className="bg-card rounded-3xl p-8 shadow-card"
            >
              <Quote className="w-8 h-8 text-secondary mb-4" />
              <p className="text-foreground/80 leading-relaxed mb-6 text-sm">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{t.parent}</p>
                <p className="text-muted-foreground text-xs">{t.child}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
