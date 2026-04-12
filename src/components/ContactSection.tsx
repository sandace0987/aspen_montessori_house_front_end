import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { WHATSAPP_NUMBER, PHONE_NUMBER, EMAIL, ADDRESS_FULL } from "@/lib/constants";

export default function ContactSection() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const leftRef = useScrollReveal<HTMLDivElement>();
  const rightRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal-fade-up text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div ref={leftRef} className="reveal-fade-up space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Address</p>
                <p className="text-muted-foreground text-sm">{ADDRESS_FULL}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Phone</p>
                <p className="text-muted-foreground text-sm">{PHONE_NUMBER}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Email</p>
                <p className="text-muted-foreground text-sm">{EMAIL}</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden h-48 mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.9432481532353!2d78.36708247470686!3d17.41451098347727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb940ee405ce89%3A0x912b9cba463e321e!2sAspen%20Montessori%20House!5e0!3m2!1sen!2sin!4v1775204932237!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div ref={rightRef} className="reveal-fade-up reveal-delay-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [`Hi, I'm ${name}.`, email && `Email: ${email}`, phone && `Phone: ${phone}`, message && `\n${message}`]
      .filter(Boolean)
      .join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="bg-card rounded-3xl p-8 shadow-card space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1.5">Parent Name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all" placeholder="Your full name" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all" placeholder="your@email.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Phone</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={15} pattern="[+0-9\s\-]*" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all" placeholder="+91 98765 43210" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Message</label>
        <textarea rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all resize-none" placeholder="Tell us about your child and what you're looking for..." />
      </div>
      <button type="submit" className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:shadow-md transition-all text-sm">
        Send via WhatsApp
      </button>
    </form>
  );
}
