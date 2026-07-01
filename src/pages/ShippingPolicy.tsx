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

export default function ShippingPolicy() {
  usePageMeta(
    `Shipping & Delivery Policy – ${SCHOOL_NAME}`,
    `Shipping and Delivery Policy for ${SCHOOL_NAME}. Explains distribution of materials and education services delivery.`
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Shipping &amp; Delivery Policy</h1>
          <p className="text-muted-foreground text-sm mb-10">Last updated: July 2026</p>

          <div className="prose prose-sm max-w-none text-foreground/85 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Shipping of Physical Goods</h2>
              <p>
                {SCHOOL_NAME} provides early childhood preschool education and daycare services. We
                do <strong>not</strong> sell, ship, or deliver any physical consumer goods or products
                via post, courier, or transport services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Service Delivery</h2>
              <p>
                All services (Montessori learning programs, classes, resource packages, and daycare services) are
                delivered **physically on-site** at our designated school campus location:
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                {ADDRESS_FULL}
              </blockquote>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Student Materials Distribution</h2>
              <p>
                Educational learning kits, workbooks, school worksheets, diaries, and reports are distributed
                directly to the parents/guardians at the school campus or given directly to the enrolled child at
                the beginning of and during the academic terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Transport Fleet Service</h2>
              <p>
                For parents subscribing to the school's transport services, pickup and drop-off are operated directly
                using the school transport fleet daily on predefined routes in Hyderabad.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Contact Information</h2>
              <p>For any queries related to service delivery and school timings, contact us:</p>
              <ul className="list-none pl-0 space-y-1">
                <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a></li>
                <li><strong>Phone:</strong> <a href={`tel:${PHONE_NUMBER}`} className="text-primary hover:underline">{PHONE_NUMBER}</a></li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
