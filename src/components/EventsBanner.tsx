import { useState } from "react";
import { CalendarDays, X } from "lucide-react";

const events = [
  "☀️ Summer Camp Begins — Apr 13",
  "🌍 Earth Day — Apr 22",
  "👨‍👩‍👧 Parent-Teacher Meeting — Apr 26",
  "👩‍👧 Mother's Day — Second Sunday of May",
  "🥭 Mango Day — May 23",
  "🧘 Yoga Day — Jun 21",
  "👨‍👧 Father's Day — Third Sunday of June",
];

const repeated = [...events, ...events];

export default function EventsBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div data-events-banner className="bg-accent text-accent-foreground overflow-hidden whitespace-nowrap relative" role="marquee" aria-label="Upcoming events">
      <div className="flex items-center h-12 animate-marquee pr-10">
        {repeated.map((event, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-base font-medium px-6">
            <CalendarDays size={14} className="shrink-0 opacity-70" />
            {event}
            <span className="opacity-30 ml-6">•</span>
          </span>
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-accent hover:bg-white transition-colors"
        aria-label="Dismiss events banner"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
