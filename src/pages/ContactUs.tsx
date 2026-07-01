import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { SCHOOL_NAME, EMAIL, PHONE_NUMBER, ADDRESS_FULL, GOOGLE_MAPS_URL } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function ContactUs() {
  usePageMeta(
    `Contact Us – ${SCHOOL_NAME}`,
    `Get in touch with ${SCHOOL_NAME} Manikonda, Hyderabad. School phone number, email address, campus location, and working hours.`
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div {...fadeUp} className="space-y-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Contact Us</h1>
            <p className="text-muted-foreground text-sm">We would love to hear from you. Get in touch with us for admissions, enrolments, or general enquiries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-foreground">Phone &amp; WhatsApp</h3>
                  <p className="text-xs text-muted-foreground">General Enquiries &amp; Admissions Hotline</p>
                  <a href={`tel:${PHONE_NUMBER}`} className="block text-sm font-medium text-primary hover:underline">{PHONE_NUMBER}</a>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-foreground">Email Address</h3>
                  <p className="text-xs text-muted-foreground">Official school communication and billing support</p>
                  <a href={`mailto:${EMAIL}`} className="block text-sm font-medium text-primary hover:underline">{EMAIL}</a>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-foreground">School Campus</h3>
                  <p className="text-xs text-muted-foreground">Visit our prepare environment in Manikonda</p>
                  <p className="text-sm font-medium text-foreground">{ADDRESS_FULL}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-foreground">School Hours</h3>
                  <p className="text-xs text-muted-foreground">Operating Schedule (Monday to Friday)</p>
                  <p className="text-sm font-medium text-foreground">09:00 AM – 05:30 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-4 shadow-sm overflow-hidden h-[350px] relative">
              <iframe
                title="School Campus Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.4095874288764!2d78.3617113!3d17.4095949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb95de93b2a265%3A0x868dd26322ad1d0e!2sAspen%20Montessori%20House!5e0!3m2!1sen!2sin!4v1716652431269!5m2!1sen!2sin"
                className="w-full h-full border-0 rounded-2xl"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
