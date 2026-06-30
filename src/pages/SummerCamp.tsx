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
import summer4Img from "@/assets/summer_4.jpg";
import summer5Img from "@/assets/summer_5.jpg";
import summer6Img from "@/assets/summer_6.jpg";
import summer7Img from "@/assets/summer_7.jpg";
import summer8Img from "@/assets/summer_8.jpg";
import summer9Img from "@/assets/summer_9.jpg";

const galleryImages = [
  {
    src: craftImg,
    alt: "Arts & crafts activities",
    position: "center 35%",
    className: "col-span-2 md:col-span-1 h-52 sm:h-56 md:h-48"
  },
  {
    src: musicImg,
    alt: "Music and movement",
    position: "center 20%",
    className: "h-40 sm:h-44 md:h-48"
  },
  {
    src: scienceImg,
    alt: "Science experiments",
    position: "center 25%",
    className: "h-40 sm:h-44 md:h-48"
  },
  {
    src: summer4Img,
    alt: "Storytelling & reading",
    position: "center 20%",
    className: "h-40 sm:h-44 md:h-48"
  },
  {
    src: summer5Img,
    alt: "Pottery & gardening",
    position: "center 20%",
    className: "col-span-2 md:col-span-1 h-52 sm:h-56 md:h-48"
  },
  {
    src: summer6Img,
    alt: "Tie & dye designs",
    position: "center 20%",
    className: "h-40 sm:h-44 md:h-48"
  },
  {
    src: summer7Img,
    alt: "Canvas painting",
    position: "center 20%",
    className: "h-40 sm:h-44 md:h-48"
  },
  {
    src: summer8Img,
    alt: "Yoga & wellness",
    position: "center 20%",
    className: "h-40 sm:h-44 md:h-48"
  },
  {
    src: summer9Img,
    alt: "Interactive games",
    position: "center 20%",
    className: "col-span-2 md:col-span-1 h-52 sm:h-56 md:h-48"
  }
];

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
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
              <Sparkles size={14} className="text-muted-foreground" /> Done for the Season!
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
              Aspen Summer Camp
            </h1>
            <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
              <Calendar size={18} /> April 13th – May 8th, 2026
            </p>
          </motion.div>

          {/* Image gallery */}
          <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${img.className}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: img.position }}
                  loading="lazy"
                />
              </div>
            ))}
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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in the next Summer Camp. Please share more details.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg transition-all"
            >
              Enquire for Next Year <ArrowUpRight size={20} />
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
