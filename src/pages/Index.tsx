import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import EventsBanner from "@/components/EventsBanner";
import HeroSection from "@/components/HeroSection";

// Lazy-load below-the-fold sections for faster FCP
const LearningSection = lazy(() => import("@/components/LearningSection"));
const MontessoriQuote = lazy(() => import("@/components/MontessoriQuote"));
const TimelineSection = lazy(() => import("@/components/TimelineSection"));
const ProgramsSection = lazy(() => import("@/components/ProgramsSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const AdmissionsCTA = lazy(() => import("@/components/AdmissionsCTA"));
const SummerCampSection = lazy(() => import("@/components/SummerCampSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

const LazyFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <EventsBanner />
      <Navbar />
      <div id="home"><HeroSection /></div>
      <Suspense fallback={<LazyFallback />}>
        <MontessoriQuote />
        <div id="about"><LearningSection /></div>
        <div id="timeline"><TimelineSection /></div>
        <div id="programs"><ProgramsSection /></div>
        <div id="summer-camp"><SummerCampSection /></div>
        <div id="gallery"><GallerySection /></div>
        <TestimonialsSection />
        <div id="admissions"><AdmissionsCTA /></div>
        <div id="contact"><ContactSection /></div>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
