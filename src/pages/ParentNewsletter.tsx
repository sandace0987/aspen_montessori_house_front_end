import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, TreePine, Users, Star, Loader2, Droplets, Palette, Music } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useAuth } from "@/context/AuthContext";

const currentNewsletter = {
  title: "The Aspen Leaf",
  edition: "July 2026",
  date: "July 10, 2026",
  articles: [
    {
      icon: Star,
      title: "Welcome Back Children!",
      content:
        "The long summer break is over, and we're thrilled to welcome Aspenities back! They're bursting with energy and excitement, ready to dive into new experiences. The atmosphere is electric, filled with chatter, laughter, and playful banter. As they reunite with friends, the entire environment comes alive. The joy and enthusiasm are palpable, lighting up the entire aura of Aspen. Our young learners are eager to explore, create, and grow. With big smiles and open hearts, they're embracing the new academic session. We're delighted to see them thrive in their peer group.",
    },
    {
      icon: Users,
      title: "First Day of School",
      content:
        "Our school is buzzing with smiles and laughter once again! Welcome back to a new year filled with learning, fun, friendship, and new adventures. Wishing everyone a wonderful academic year ahead!",
    },
    {
      icon: Star,
      title: "Father's Day Celebration",
      content:
        "It was a day to remember at school as Fathers were invited and children presented thoughtful and handmade gifts to their fathers, expressing love and gratitude. The celebration continued with exciting father-child games and a joyful cake-cutting session for all our super-dads.",
    },
    {
      icon: BookOpen,
      title: "Yoga Day Celebration",
      content:
        "Aspen celebrated International Yoga Day. This year’s theme, 'Yoga for One Earth, One Health,' highlighted the deep connection between personal well-being and the health of our planet.",
    },
    {
      icon: Users,
      title: "Implementation of Second Shift",
      content:
        "Based on requests from a few parents, we are introducing a second shift for Mont-1 and Mont-2 children. The shift timings will be 11:30 AM – 3:00 PM. Parents who wish to opt for this shift may message us. Admissions will be on a first-come, first-served basis due to limited seats. Thank you for your cooperation.",
    },
    {
      icon: Star,
      title: "Our Website Just Got Better!",
      content:
        "We're excited to announce the launch of the enhanced Aspen Montessori House website, thoughtfully designed to make your experience smoother, simpler, and more convenient. One of the biggest highlights is our new Parent Login Portal—your dedicated space to access important school information anytime, anywhere. Parents can also pay school fees securely online, making the entire process quick, safe, and hassle-free. We are proud to have launched this new website, and you are currently on it! Explore more features as we continue to enhance your digital experience.",
    },
    {
      icon: TreePine,
      title: "Classroom Highlights & Learning Activities",
      content:
        "Our mixed-age environments are actively engaged in learning: Mont-3 children are busy exploring Sensorial materials and Practical Life activities with lots of curiosity and joy. Mont-2 children are happily enjoying the learning process as they review what they know and build new confidence. Mont-1 children are growing more comfortable each day, learning to be independent and make friends. Our toddlers are gradually adjusting to their new environment with gentle support and routine, becoming more settled and confident with teachers and peers.",
    },
  ],
  monthlyThemes: {
    theme: "Water",
    color: "BLUE",
    song: "Row-Row-Row your boat",
    story: "Blue Umbrella",
  },
  upcomingEvents: [
    {
      date: "Jul 24",
      event: "Show & Tell Activity (Attire: BLUE). Mont-2 & Mont-3 children are expected to find any naturally BLUE-colored object and speak about it in 2-3 lines. Mont-1 children bring any blue-colored object, image, or toy.",
    },
  ],
};

export default function ParentNewsletter() {
  const { isAuthenticated, isLoading, roles } = useAuth();
  usePageMeta("Parent Newsletter – Aspen Montessori", undefined, { noindex: true });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (!roles.includes("parent") && !roles.includes("admin"))) {
    return <Navigate to="/parent" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Back link */}
        <Link
          to="/parent"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-2">Parent Newsletter</p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{currentNewsletter.title}</h1>
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar size={14} />
            {currentNewsletter.edition} &middot; Published {currentNewsletter.date}
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-8 mb-12">
          {currentNewsletter.articles.map((article) => (
            <article key={article.title} className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <article.icon size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">{article.title}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{article.content}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Monthly Themes & Upcoming Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Themes */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Droplets className="text-blue-500" size={20} />
              Themes of the Month
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="font-semibold text-muted-foreground w-36">Theme of the Month:</span>
                <span className="text-foreground font-medium">{currentNewsletter.monthlyThemes.theme}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold text-muted-foreground w-36">Color of the Month:</span>
                <span className="text-blue-600 font-bold">{currentNewsletter.monthlyThemes.color}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold text-muted-foreground w-36">Song of the Month:</span>
                <span className="text-foreground font-medium flex items-center gap-1.5">
                  <Music size={14} className="text-muted-foreground" />
                  {currentNewsletter.monthlyThemes.song}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold text-muted-foreground w-36">Story of the Month:</span>
                <span className="text-foreground font-medium flex items-center gap-1.5">
                  <BookOpen size={14} className="text-muted-foreground" />
                  {currentNewsletter.monthlyThemes.story}
                </span>
              </li>
            </ul>
          </div>

          {/* Upcoming Events sidebar */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/20 pb-3">
              <Calendar className="text-primary" size={20} />
              Upcoming Events
            </h3>
            <ul className="space-y-4">
              {currentNewsletter.upcomingEvents.map((evt) => (
                <li key={evt.event} className="flex items-start gap-3">
                  <span className="shrink-0 text-xs font-bold text-primary bg-primary/10 rounded-lg px-2.5 py-1 w-20 text-center">
                    {evt.date}
                  </span>
                  <span className="text-sm text-foreground leading-relaxed">{evt.event}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
