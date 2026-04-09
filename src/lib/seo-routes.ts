/**
 * SEO metadata for each public route.
 * Used by the Vite build plugin to generate per-route HTML files
 * with unique meta tags.
 */
export interface SeoRoute {
  path: string;
  title: string;
  description: string;
  /** Raw HTML injected into #root so crawlers see real content before JS loads */
  criticalHtml?: string;
}

export const seoRoutes: SeoRoute[] = [
  {
    path: "/",
    title: "Aspen Montessori Hyderabad – Preschool & Daycare",
    description:
      "Aspen Montessori is a leading Montessori preschool and daycare in Hyderabad offering Toddlers, Montessori 1, Montessori 2, Montessori 3 & Daycare for children aged 1.5–6 years.",
    criticalHtml: `<h1>Aspen Montessori Hyderabad – Preschool &amp; Daycare</h1>
      <p>A nurturing Montessori environment where children aged 1.5–6 years discover, explore, and grow.</p>
      <h2>Our Programs</h2>
      <ul>
      <li><strong>Toddlers</strong> – Ages 1.5–2.5 years (9:00 AM – 12:30 PM)</li>
        <li><strong>Montessori 1</strong> – Ages 3–4 years (9:00 AM – 12:30 PM)</li>
        <li><strong>Montessori 2</strong> – Ages 4–5 years (9:00 AM – 12:30 PM)</li>
        <li><strong>Montessori 3</strong> – Ages 5+ years (9:00 AM – 2:30 PM)</li>
        <li><strong>Daycare</strong> – Ages 1.5–6 years</li>
      </ul>
      <nav>
        <a href="/about">About Us</a>
        <a href="/programs">Programs</a>
        <a href="/gallery">Gallery</a>
        <a href="/newsletter">Newsletter</a>
        <a href="/summer-camp">Summer Camp 2026</a>
      </nav>
      <p>Located in Hyderabad, Telangana. <a href="tel:+917032000862">Call +91 7032000862</a></p>`,
  },
  {
    path: "/about",
    title: "About Us – Aspen Montessori Hyderabad",
    description:
      "Learn about Aspen Montessori's mission, values, and journey as a leading Montessori preschool in Hyderabad.",
    criticalHtml: `<h1>About Aspen Montessori</h1>
      <p>Founded in 2016, Aspen Montessori is a leading early-childhood education centre in Hyderabad following the Montessori philosophy of hands-on, child-led learning.</p>
      <h2>Our Mission</h2>
      <p>To provide a joyful, inclusive Montessori environment where every child is empowered to learn at their own pace and build the skills they need to flourish in life.</p>
      <h2>Our Vision</h2>
      <p>To provide an enriching Montessori environment that encourages self-directed learning, critical thinking, and holistic development — nurturing confident, compassionate children who are prepared for the world ahead.</p>
      <h2>Why Montessori?</h2>
      <ul><li>Exercises of Practical Life</li><li>Sensorial</li><li>Arithmetic</li><li>Language</li><li>Cultural</li></ul>
      <h2>Our Values</h2>
      <ul><li>Nurturing Care</li><li>Observation-Led</li><li>Curiosity First</li><li>Safe Environment</li><li>Excellence</li><li>Community</li></ul>
      <h2>Milestones</h2>
      <p>2016: Founded with best-in-class Montessori materials · 2017: Dedicated transport fleet · 2018: Khel Aspen sports event · 2019–2020: Digital curriculum for COVID online classes · 2025: 200+ families served · 2026: 10+ batches graduated.</p>
      <h2>Achievements &amp; Recognition</h2>
      <p>Recognised for excellence in Montessori education, innovative curriculum design, and meaningful community impact.</p>
      <h2>Our Teaching &amp; Staff</h2>
      <p>An all-women teaching staff with long tenure, regular professional development, and a 1:7 adult-to-children ratio ensuring personalised attention.</p>
      <nav><a href="/">Home</a> · <a href="/programs">Programs</a> · <a href="/gallery">Gallery</a></nav>`,
  },
  {
    path: "/programs",
    title: "Programs – Aspen Montessori Hyderabad",
    description:
      "Explore Toddlers, Montessori 1, Montessori 2, Montessori 3 & Daycare programs at Aspen Montessori for children aged 1.5 to 6 years.",
    criticalHtml: `<h1>Our Programs</h1>
      <p>Each program follows authentic Montessori pedagogy tailored to your child's developmental stage.</p>
      <h2>Toddlers (1.5–2.5 years) — 9:00 AM – 12:30 PM</h2><p>Sensory exploration and early independence in a safe, nurturing environment.</p>
      <h2>Montessori 1 (3–4 years) — 9:00 AM – 12:30 PM</h2><p>Building foundational skills through hands-on Montessori materials.</p>
      <h2>Montessori 2 (4–5 years) — 9:00 AM – 12:30 PM</h2><p>Deepening literacy, arithmetic, and cultural studies.</p>
      <h2>Montessori 3 (5+ years) — 9:00 AM – 2:30 PM</h2><p>Advanced preparation for primary school with reading, writing, and mathematics.</p>
      <h2>Daycare (1.5–6 years) — 9:00 AM – 5:30 PM</h2><p>Extended care blending Montessori activities with rest and play.</p>
      <nav><a href="/">Home</a> · <a href="/about">About Us</a> · <a href="/gallery">Gallery</a></nav>`,
  },
  {
    path: "/gallery",
    title: "Gallery – Aspen Montessori Hyderabad",
    description:
      "See photos of life at Aspen Montessori — classrooms, outdoor play, art activities, and happy children learning through Montessori methods.",
    criticalHtml: `<h1>Gallery</h1>
      <p>Photos of life at Aspen Montessori — classrooms, outdoor play, art activities, and happy children learning through Montessori methods in Hyderabad.</p>
      <nav><a href="/">Home</a> · <a href="/about">About Us</a> · <a href="/programs">Programs</a></nav>`,
  },
  {
    path: "/newsletter",
    title: "Newsletter – Aspen Montessori Hyderabad",
    description: "Stay updated with the latest news, events, and stories from Aspen Montessori Hyderabad.",
    criticalHtml: `<h1>Newsletter</h1>
      <p>Stay updated with the latest news, events, and stories from Aspen Montessori Hyderabad. Read about student achievements, upcoming events, and Montessori insights.</p>
      <nav><a href="/">Home</a> · <a href="/about">About Us</a> · <a href="/programs">Programs</a></nav>`,
  },
  {
    path: "/summer-camp",
    title: "Summer Camp 2026 – Aspen Montessori Hyderabad",
    description:
      "Aspen Montessori Summer Camp from April 13 to May 8, 2026. Arts, science, music, dance and more fun activities for children in Hyderabad.",
    criticalHtml: `<h1>Summer Camp 2026</h1>
      <p>Aspen Montessori Summer Camp runs from April 13 to May 8, 2026. Activities include arts &amp; crafts, science experiments, music, dance, and outdoor adventures for children in Hyderabad.</p>
      <p>Open to children aged 2–8 years. <a href="tel:+917032000862">Call +91 7032000862</a> to register.</p>
      <nav><a href="/">Home</a> · <a href="/about">About Us</a> · <a href="/programs">Programs</a></nav>`,
  },
  {
    path: "/privacy",
    title: "Privacy Policy – Aspen Montessori Hyderabad",
    description:
      "Privacy Policy for Aspen Montessori House. Learn how we collect, use, and protect your personal information.",
    criticalHtml: `<h1>Privacy Policy</h1>
      <p>Learn how Aspen Montessori House collects, uses, and protects your personal information in accordance with India's Digital Personal Data Protection Act, 2023.</p>
      <nav><a href="/">Home</a> · <a href="/about">About Us</a> · <a href="/terms">Terms &amp; Conditions</a></nav>`,
  },
  {
    path: "/terms",
    title: "Terms & Conditions – Aspen Montessori Hyderabad",
    description:
      "Terms and Conditions for using the Aspen Montessori website. Read about website usage, disclaimers, and policies.",
    criticalHtml: `<h1>Terms &amp; Conditions</h1>
      <p>Terms and Conditions for using the Aspen Montessori House website. Read about website usage, intellectual property, disclaimers, and governing law.</p>
      <nav><a href="/">Home</a> · <a href="/about">About Us</a> · <a href="/privacy">Privacy Policy</a></nav>`,
  },
];
