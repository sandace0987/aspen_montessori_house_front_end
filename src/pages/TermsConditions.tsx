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

export default function TermsConditions() {
  usePageMeta(
    `Terms & Conditions – ${SCHOOL_NAME}`,
    `Terms and Conditions for using the ${SCHOOL_NAME} website. Read about website usage, disclaimers, and policies.`
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Terms &amp; Conditions</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: April 2026</p>

          <div className="prose prose-sm max-w-none text-foreground/85 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the {SCHOOL_NAME} website at{" "}
                <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a>, you
                agree to be bound by these Terms and Conditions. If you do not agree, please do not
                use this website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Use of Website</h2>
              <p>This website is provided for informational purposes about {SCHOOL_NAME} and its programs. You agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the website only for lawful purposes.</li>
                <li>Not attempt to gain unauthorized access to any part of the website.</li>
                <li>Not reproduce, distribute, or modify any content without our written consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Intellectual Property</h2>
              <p>
                All content on this website — including text, images, logos, and design — is the
                property of {SCHOOL_NAME} and is protected by applicable intellectual property laws.
                Unauthorized use is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Admissions &amp; Programs</h2>
              <p>
                Information about programs, fees, schedules, and admissions on this website is
                provided for general guidance. {SCHOOL_NAME} reserves the right to modify programs,
                fees, and policies at any time. Admission is subject to availability and our
                admissions process.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. External Links</h2>
              <p>
                Our website may contain links to external websites (e.g., Google Forms for
                admissions). We are not responsible for the content or privacy practices of these
                third-party sites.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
              <p>
                {SCHOOL_NAME} provides this website "as is" and makes no warranties, expressed or
                implied. We shall not be liable for any damages arising from the use of this
                website or reliance on its content.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">7. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of India.
                Any disputes shall be subject to the exclusive jurisdiction of the courts in
                Hyderabad, Telangana.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">8. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of the website after
                changes are posted constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">9. Contact Us</h2>
              <p>For questions about these Terms, please contact us:</p>
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
