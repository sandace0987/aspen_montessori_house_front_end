import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { SCHOOL_NAME, EMAIL, PHONE_NUMBER, ADDRESS_FULL, SITE_URL } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function PrivacyPolicy() {
  usePageMeta(
    `Privacy Policy – ${SCHOOL_NAME}`,
    `Privacy Policy for ${SCHOOL_NAME}. Learn how we collect, use, and protect your personal information.`
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div {...fadeUp}>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: April 2026</p>

          <div className="prose prose-sm max-w-none text-foreground/85 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
              <p>
                {SCHOOL_NAME} ("we", "our", or "us") is committed to protecting the privacy of
                children, parents, and visitors. This Privacy Policy explains how we collect, use,
                and safeguard information when you visit our website at{" "}
                <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a> or
                interact with us.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Contact details</strong> — name, phone number, and email address provided via our admissions or enquiry forms (hosted on Google Forms).</li>
                <li><strong>Child information</strong> — child's name, age, and preferred program, submitted during the admissions process.</li>
                <li><strong>Website usage data</strong> — anonymous analytics such as page views, browser type, and device information collected through standard web technologies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To respond to enquiries and process admissions.</li>
                <li>To share newsletters, event updates, and school announcements.</li>
                <li>To improve our website and services.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Data Sharing</h2>
              <p>
                We do <strong>not</strong> sell, trade, or rent your personal information to third
                parties. We may share data with trusted service providers (e.g., Google Forms,
                analytics tools) solely to operate our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Data Protection</h2>
              <p>
                We implement reasonable security measures to protect your information. However, no
                method of transmission over the internet is 100% secure. We strive to protect your
                data in accordance with India's Digital Personal Data Protection Act, 2023.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Children's Privacy</h2>
              <p>
                Our website is not directed at children. We do not knowingly collect personal
                information from children online. Any child-related data is provided by parents or
                guardians during the admissions process.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Withdraw consent for communications at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">8. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none pl-0 space-y-1">
                <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a></li>
                <li><strong>Phone:</strong> <a href={`tel:${PHONE_NUMBER}`} className="text-primary hover:underline">{PHONE_NUMBER}</a></li>
                <li><strong>Address:</strong> {ADDRESS_FULL}</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
