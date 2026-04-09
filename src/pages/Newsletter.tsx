import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, TreePine, Users, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const currentNewsletter = {
  title: "The Aspen Leaf",
  edition: "March 2026",
  date: "March 15, 2026",
  articles: [
    {
      icon: TreePine,
      title: "Hands-on Learning in the Environment",
      content:
        "Children are actively engaging in practical life activities like sieving, which help develop fine motor skills, concentration, and independence. These experiences also introduce early scientific concepts through exploration of texture and materials.",
    },
    {
      icon: BookOpen,
      title: "Language & Arithmetic in Action",
      content:
        "Our Montessori classrooms are buzzing with learning as children explore sounds using Moveable Alphabets and build number sense through materials like Number Rods and Addition Strip Boards. These hands-on tools support deep understanding through self-paced discovery.",
    },
    {
      icon: Users,
      title: "Toddler Learning Highlights",
      content:
        "Our toddlers are building vocabulary through engaging language activities while exploring shapes and concepts through transport-themed play. This blend of movement and learning supports early cognitive development in a joyful way.",
    },
    {
      icon: Star,
      title: "Celebrations & Cultural Learning",
      content:
        "From vibrant Sankranthi celebrations with kites and rangoli to meaningful Republic Day activities, children experienced culture, community, and values in an engaging and age-appropriate way.",
    },
  ],
  upcomingEvents: [
    { date: "Apr 13", event: "Summer Camp Begins" },
    { date: "Apr 22", event: "Earth Day Celebration" },
    { date: "Apr 26", event: "Parent-Teacher Meeting" },
    { date: "Second Sunday of May", event: "Mother’s Day Celebration" },
  ],
};

export default function Newsletter() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-2">Monthly Newsletter</p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{currentNewsletter.title}</h1>
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar size={14} />
            {currentNewsletter.edition} &middot; Published {currentNewsletter.date}
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-8 mb-16">
          {currentNewsletter.articles.map((article) => (
            <article key={article.title} className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <article.icon size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">{article.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{article.content}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Upcoming Events sidebar */}
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
          <ul className="space-y-3">
            {currentNewsletter.upcomingEvents.map((evt) => (
              <li key={evt.event} className="flex items-center gap-3">
                <span className="shrink-0 text-xs font-bold text-primary bg-primary/10 rounded-lg px-2.5 py-1 w-20 text-center">
                  {evt.date}
                </span>
                <span className="text-sm text-foreground">{evt.event}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
