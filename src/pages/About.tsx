import { Link } from "react-router-dom";
import { ADMISSIONS_FORM_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import founder1Img from "@/assets/founder-1.jpg";
import founder2Img from "@/assets/founder-2.jpg";
import teamAspenImg from "@/assets/team-aspen.jpg";
import {
  ArrowLeft,
  Heart,
  Eye,
  Star,
  Lightbulb,
  Shield,
  Users,
  Sprout,
  School,
  Award,
  Smartphone,
  Laptop,
  Trophy,
  HandHeart,
  BookOpen,
  Globe,
  Calculator,
  MessageCircle,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { TeacherCarousel } from "@/components/LearningSection";
import { Badge } from "@/components/ui/badge";

import { fadeUp } from "@/lib/animations";

const values = [
  {
    icon: Heart,
    title: "Nurturing Care",
    desc: "Every child is valued, respected, and loved. We create a warm atmosphere where children feel safe to explore.",
  },
  {
    icon: Eye,
    title: "Observation-Led",
    desc: "Our teachers carefully observe each child to tailor learning experiences to their individual pace and interests.",
  },
  {
    icon: Lightbulb,
    title: "Curiosity First",
    desc: "We ignite a lifelong love of learning by encouraging questions, experimentation, and creative thinking.",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    desc: "Our campus is thoughtfully designed with child safety at every corner — secure, clean, and welcoming.",
  },
  {
    icon: Star,
    title: "Excellence",
    desc: "We uphold the highest Montessori standards with certified guides, quality materials, and continuous improvement.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Families, teachers, and children form a close-knit community built on trust, communication, and shared growth.",
  },
];

const milestones = [
  {
    year: "2016",
    event:
      "Inception of Aspen Montessori — launched Pre-Primary and Daycare programmes, equipped with best-in-class IMTC and IIMS Montessori materials.",
    icon: Sprout,
  },
  {
    year: "2017",
    event: "Introduced a dedicated transport fleet, making safe and convenient commutes a reality for every family.",
    icon: School,
  },
  {
    year: "2018",
    event:
      "Rolled out cultural celebrations, annual day festivities, and Khel Aspen — our signature sports event fostering teamwork and fitness.",
    icon: Award,
  },
  {
    year: "2019–2020",
    event:
      "Remodelled curriculum and activity materials for digital delivery to support online classes during COVID-19. Children from outside Hyderabad also joined our community.",
    icon: Laptop,
  },
  {
    year: "2025",
    event:
      "Crossed the milestone of 200+ families served, a testament to the trust parents place in Aspen's nurturing approach.",
    icon: Users,
  },
  {
    year: "2026",
    event:
      "Proudly celebrated the graduation of 10 batches of confident, curious learners — ready to step into the next phase of their journey.",
    icon: Star,
  },
  {
    year: "2026",
    event:
      "Launched a revamped website and strengthened community engagement through newsletters and digital outreach.",
    icon: Smartphone,
  },
];

const montessoriAreas = [
  {
    icon: HandHeart,
    title: "Exercises of Practical Life",
    desc: "Daily living activities that build independence, coordination, and concentration.",
  },
  {
    icon: Sparkles,
    title: "Sensorial",
    desc: "Materials that refine the senses and help children classify and understand the world around them.",
  },
  {
    icon: Calculator,
    title: "Arithmetic",
    desc: "Hands-on materials that make abstract mathematical concepts concrete and accessible.",
  },
  {
    icon: BookOpen,
    title: "Language",
    desc: "A rich environment that nurtures vocabulary, phonics, reading, and writing naturally.",
  },
  {
    icon: Globe,
    title: "Cultural",
    desc: "Geography, science, art, and music that broaden a child's understanding of the world.",
  },
];

const hashtags = [
  "#MontessoriEducation",
  "#ChildLedLearning",
  "#HyderabadPreschool",
  "#HolisticDevelopment",
  "#EarlyChildhood",
];

export default function About() {
  const [whyTab, setWhyTab] = useState<"montessori" | "aspen">("montessori");

  const founders = useMemo(() => {
    const arr = [
      {
        name: "Jyothi Mohite",
        role: "Director",
        img: founder1Img,
        degrees: ["IMC"],
        bio: `With over 20 years in education, she co-founded Aspen in 2016 to give every child a strong, nurturing start. She has built her expertise at leading institutions like Oakridge, Chirec, and Vignan. Blending IB and PYP frameworks with a deep understanding of "a child's psychology", she creates classrooms where curiosity and creativity thrive. Known for her energy and optimism, she makes learning engaging and joyful. Outside school, she enjoys gardening, singing, and music, reflecting the same harmony she brings to her teaching.`,
      },
      {
        name: "Vani Dhanashri",
        role: "Director",
        img: founder2Img,
        degrees: ["IMTC", "IIMS"],
        bio: "Founding member of Aspen Montessori House, an experienced Montessorian educator with over 20 years in teaching. She holds an MBA in HR and Systems, along with Montessori certifications from IMTC and IIMS, Bangalore.\n\nStarting her career as a lecturer, she found her true calling in early childhood education. She is deeply committed to holistic child development, fostering independence, curiosity, and a love for learning.\n\nAs a leader, she blends structure with empathy, creating a supportive, child-centred environment where both children and educators thrive.",
      },
    ];
    const seconds = new Date().getSeconds();
    return seconds % 2 === 0 ? arr : [...arr].reverse();
  }, []);

  usePageMeta(
    "About Us – Aspen Montessori Hyderabad",
    "Learn about Aspen Montessori's mission, values, and journey as a leading Montessori preschool in Hyderabad.",
  );
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Hero */}
        <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2">About Us</p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              A Place Where Children <span className="text-primary">Bloom</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
              Founded in <strong className="text-foreground">2016</strong>, Aspen Montessori House is a leading
              early-childhood education centre in Hyderabad, proudly led by an all-women team. We follow the Montessori
              philosophy — hands-on, child-led learning in a prepared environment — to help every child develop
              confidence, independence, and a lifelong love of discovery.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
              Our certified Montessori guides, thoughtfully designed classrooms, and strong parent partnerships create a
              nurturing ecosystem where children thrive academically, socially, and emotionally.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {hashtags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <TeacherCarousel className="h-[350px] lg:h-[450px]" />
        </motion.div>

        {/* Mission & Vision */}
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="bg-primary rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">Our Mission</h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              To provide a joyful, inclusive Montessori environment where every child is empowered to learn at their own
              pace, develop critical thinking, and build the social-emotional skills they need to flourish in life.
            </p>
          </div>
          <div className="bg-accent rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-accent-foreground mb-4">Our Vision</h2>
            <p className="text-accent-foreground/80 leading-relaxed">
              To provide an enriching Montessori environment that encourages self-directed learning, critical thinking,
              and holistic development — nurturing confident, compassionate children who are prepared for the world
              ahead.
            </p>
          </div>
        </motion.div>

        {/* Why Montessori / Why Aspen Toggle */}
        <motion.div {...fadeUp} className="mb-20">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-10">
            <div className="flex justify-center mb-8">
              <div
                className="inline-flex bg-muted rounded-full p-1"
                role="tablist"
                aria-label="Why Montessori or Why Aspen"
              >
                <button
                  role="tab"
                  aria-selected={whyTab === "montessori"}
                  onClick={() => setWhyTab("montessori")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${whyTab === "montessori" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Why Montessori?
                </button>
                <button
                  role="tab"
                  aria-selected={whyTab === "aspen"}
                  onClick={() => setWhyTab("aspen")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${whyTab === "aspen" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Why Aspen?
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {whyTab === "montessori" ? (
                <motion.div
                  key="montessori"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-muted-foreground text-base leading-relaxed max-w-3xl mx-auto text-center mb-8">
                    The Montessori method is a child-centred educational approach based on scientific observation. It
                    emphasises hands-on learning, self-paced discovery, and respect for a child's natural psychological
                    development. Children learn through purposeful activity in a carefully prepared mixed-age group
                    environment, guided by trained educators.
                  </p>
                  <h3 className="text-lg font-semibold text-center mb-6">The 5 Areas of Montessori Learning</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {montessoriAreas.map((area) => (
                      <div key={area.title} className="bg-secondary/20 rounded-2xl p-5 text-center">
                        <area.icon size={28} className="text-primary mx-auto mb-3" />
                        <h4 className="text-sm font-semibold mb-1">{area.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{area.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="aspen"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-muted-foreground text-base leading-relaxed max-w-3xl mx-auto text-center mb-4">
                    Children are naturally curious — they ask endless questions, explore fearlessly, and want to
                    understand everything around them. At Aspen, we don't just allow this — we{" "}
                    <strong className="text-foreground">encourage</strong> it. Every question is valued, every curiosity
                    is nurtured, and every child is given the freedom to learn at their own pace.
                  </p>
                  <p className="text-muted-foreground text-base leading-relaxed max-w-3xl mx-auto text-center mb-6">
                    Our certified Montessori guides create thoughtfully prepared environments where children develop
                    independence, critical thinking, and a deep love for learning. With personalised learning paths and
                    small group sizes, we ensure every child receives the attention they deserve.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    {[
                      { icon: UserCheck, text: "Certified Montessori Guides" },
                      { icon: Sparkles, text: "Prepared Learning Environments" },
                      { icon: MessageCircle, text: "Personalised Learning Paths" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 bg-secondary/20 rounded-xl p-4">
                        <item.icon size={20} className="text-primary shrink-0" />
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div {...fadeUp} className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">What We Stand For</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values guide every decision we make — from classroom design to parent communication.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary/30 flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div {...fadeUp} className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Our Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Key milestones that shaped Aspen Montessori.
            </p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-primary/25" />
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <motion.div
                  key={`${m.year}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-5 relative py-6 first:pt-0 last:pb-0"
                >
                  <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <m.icon size={18} className="text-primary-foreground" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm font-semibold text-primary mb-1">{m.year}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievements & Recognition */}
        <motion.div {...fadeUp} className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Achievements & Recognition</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Milestones of excellence in early childhood education.
            </p>
          </div>

          {/* Award Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Trophy,
                title: "Most Promising Montessori School",
                desc: "Recognised at the Woman Leaders Forum 2023 by Global Empire Events & BizNation TV as the Most Promising Montessori School in Hyderabad.",
              },
              {
                icon: Award,
                title: "10 Years of Excellence",
                desc: "A decade of nurturing young minds — 10+ batches graduated, 200+ families served, and a thriving Montessori community since 2016.",
              },
              {
                icon: Star,
                title: "Community Trust",
                desc: "Built on word-of-mouth and parent referrals, reflecting the deep trust families place in Aspen's approach to early childhood education.",
              },
            ].map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <award.icon size={26} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{award.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Founder's Corner */}
        <motion.div {...fadeUp} className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Director's Corner</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Meet the passionate minds behind Aspen Montessori.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="bg-card rounded-2xl border border-border p-6 md:p-8 text-center hover:shadow-md transition-shadow"
              >
                <img
                  src={f.img}
                  alt={f.name}
                  className="w-32 h-32 rounded-full object-cover object-top mx-auto mb-5 border-4 border-primary/20"
                  loading="lazy"
                  width={112}
                  height={112}
                />
                <h3 className="text-xl font-semibold mb-1">{f.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{f.role}</p>
                <div className="flex justify-center gap-2 mb-3">
                  {f.degrees.map((d) => (
                    <span
                      key={d}
                      className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Teaching & Staff */}
        <motion.div {...fadeUp} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Our Teaching & Staff</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The heart of Aspen — a dedicated team committed to every child's growth.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 mb-8">
            <ul className="space-y-4">
              {[
                "An all-women teaching staff with long tenure at the school, providing stability and continuity for every child.",
                "Regular sensitisation and professional development programmes for women employees, empowering our educators to grow alongside the children.",
                "Dedicated, experienced educators committed to each child's holistic growth — academically, socially, and emotionally.",
                "A 1:7 adult-to-children ratio ensuring personalised attention and a safe, nurturing classroom experience.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  <span className="text-muted-foreground text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden">
            <img
              src={teamAspenImg}
              alt="Team Aspen — our dedicated teaching staff"
              className="w-full h-64 md:h-80 object-cover"
              loading="lazy"
              width={768}
              height={320}
            />
            <p className="text-center text-sm font-semibold text-primary mt-4">#TeamAspen</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp} className="text-center bg-secondary/20 rounded-3xl p-10 md:p-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to See Aspen in Action?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
            Schedule a campus visit and discover why families across Hyderabad choose Aspen Montessori.
          </p>
          <a
            href={ADMISSIONS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all"
          >
            Book a Visit
          </a>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
