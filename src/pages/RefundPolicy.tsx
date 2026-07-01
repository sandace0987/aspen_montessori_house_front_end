import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { SCHOOL_NAME, EMAIL, PHONE_NUMBER, ADDRESS_FULL } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function RefundPolicy() {
  usePageMeta(
    `Cancellation & Refund Policy – ${SCHOOL_NAME}`,
    `Cancellation and Refund Policy for ${SCHOOL_NAME} fee accounts and online transactions.`
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Cancellation &amp; Refund Policy</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: July 2026</p>

          <div className="prose prose-sm max-w-none text-foreground/85 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Fee Cancellation</h2>
              <p>
                Once a student is enrolled, the parent subscribes to the term fee plan. Any request for
                cancellation of admission or subscription withdrawal must be submitted in writing to the
                school administration.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Refund Terms</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Admission & Registration Fee</strong> — The initial one-time admission registration
                  fee is non-refundable under any circumstances.
                </li>
                <li>
                  <strong>Term Tuition Fees</strong> — Tuition fees paid for an ongoing term/quarter are
                  non-refundable once the term has commenced.
                </li>
                <li>
                  <strong>Mid-Term Withdrawal</strong> — If a child is withdrawn mid-term, no pro-rata refund
                  of the tuition fee for that quarter/term will be issued.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Double Payments &amp; Excess Fees</h2>
              <p>
                In case of duplicate transactions or excess payment debits due to technical glitches during the
                online Razorpay transaction:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The excess amount will be refunded directly back to the original payment source account.</li>
                <li>Refund processing typically takes <strong>7-10 working days</strong> depending on the banking channels.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Contact For Refunds</h2>
              <p>For any billing discrepancies, double charges, or refund status checks, please contact us:</p>
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
