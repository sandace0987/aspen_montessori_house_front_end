import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MapPin, Star, Sparkles, Calendar, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsBanner from "@/components/EventsBanner";
import ComingSoonPage from "@/components/ComingSoonPage";
import { usePageMeta } from "@/hooks/use-page-meta";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { PHONE_NUMBER, PHONE_NUMBER_RAW, SCHOOL_NAME, ADDRESS_FULL, WHATSAPP_NUMBER } from "@/lib/constants";
import summerCampIcon from "@/assets/summer-camp-icon.png";
import craftImg from "@/assets/summer_1.jpg";
import musicImg from "@/assets/summer_2.jpg";
import scienceImg from "@/assets/summer_3.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, duration: 0.7 },
};

const keyActivities = [
  "Arts & Craft",
  "Story Telling",
  "Music",
  "Dance",
  "Tie & Dye",
  "Team Building",
];

const additionalActivities = [
  "Science Experiments",
  "Pottery",
  "Yoga",
  "Miniature Gardening",
  "Non-Stove Cooking",
  "Tote Bag Painting",
  "Collage Making",
  "Canvas Painting",
  "Reading",
  "Puppet Show",
  "Team Building Games",
];

export default function SummerCamp() {
  usePageMeta(
    "Summer Camp 2026 – Aspen Montessori Hyderabad",
    "Aspen Montessori Summer Camp from April 13 to May 8, 2026. Arts, science, music, dance and more for children in Hyderabad."
  );

  if (!FEATURE_FLAGS.summerCampEnabled) {
    return <ComingSoonPage title="Summer Camp" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <EventsBanner />
      <Navbar />

      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium mb-8"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          {/* Hero */}
          <motion.div {...fadeUp} className="text-center mb-12">
            <img src={summerCampIcon} alt="" className="w-20 h-20 mx-auto mb-4" width={512} height={512} loading="lazy" />
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              <Sparkles size={14} /> Summer 2026
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
              Aspen Summer Camp
            </h1>
            <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
              <Calendar size={18} /> April 13<sup>th</sup> – May 8<sup>th</sup>, 2026
            </p>
          </motion.div>

          {/* Image gallery */}
          <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden h-52 sm:h-56 md:h-44">
              <img
                src={craftImg}
                alt="Arts and crafts"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 35%" }}
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-40 sm:h-44 md:h-44">
              <img
                src={musicImg}
                alt="Music and dance"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 40%" }}
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-40 sm:h-44 md:h-44">
              <img
                src={scienceImg}
                alt="Science experiments"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 25%" }}
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Key Activities */}
          <motion.div {...fadeUp} className="bg-card rounded-2xl p-6 md:p-8 border border-border mb-6">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <Star size={20} className="text-primary" /> Key Activities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {keyActivities.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2 text-sm font-medium text-foreground/80"
                >
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Activities */}
          <motion.div {...fadeUp} className="bg-card rounded-2xl p-6 md:p-8 border border-border mb-6">
            <h2 className="text-xl font-bold text-foreground mb-5">
              Additional Activities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {additionalActivities.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2 text-sm text-foreground/70"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Venue & Contact */}
          <motion.div {...fadeUp} className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20 mb-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground">Venue</h3>
                  <p className="text-sm text-muted-foreground">{SCHOOL_NAME}</p>
                  <p className="text-sm text-muted-foreground">{ADDRESS_FULL}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-primary mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground">Contact</h3>
                  <a
                    href={`tel:${PHONE_NUMBER_RAW}`}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    {PHONE_NUMBER}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Register CTA */}
          <motion.div {...fadeUp} className="text-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in the Summer Camp 2026. Please share the details.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg transition-all"
            >
              Register <ArrowUpRight size={20} />
            </a>
          </motion.div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {["Science", "Art", "Fun", "Games", "Team Building"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
