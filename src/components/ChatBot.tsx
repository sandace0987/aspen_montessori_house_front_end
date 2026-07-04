import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatbotQA, FALLBACK_MESSAGE } from "@/lib/chatbot-data";

interface Message {
  type: "bot" | "user";
  content: string;
  isHtml?: boolean;
}

const WELCOME = "Hi there! 👋 I'm the Aspen Montessori assistant. How can I help you today?";

const playChime = (type: "open" | "close") => {
  try {
    const audio = new Audio(type === "open" ? "/chime-open.wav" : "/chime-close.wav");
    audio.volume = 0.35;
    audio.play().catch(() => {});
  } catch {}
};

export default function ChatBot() {
  const isExcluded = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  if (isExcluded) return null;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ type: "bot", content: WELCOME }]);
  const [showQuestions, setShowQuestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showQuestions]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      playChime(prev ? "close" : "open");
      return !prev;
    });
  }, []);

  const handleQuestion = (index: number) => {
    const qa = chatbotQA[index];
    setMessages((prev) => [
      ...prev,
      { type: "user", content: qa.question },
      { type: "bot", content: qa.answer, isHtml: true },
    ]);
    setShowQuestions(true);
  };

  const handleOtherQuery = () => {
    setMessages((prev) => [
      ...prev,
      { type: "user", content: "I have another question" },
      { type: "bot", content: FALLBACK_MESSAGE, isHtml: true },
    ]);
    setShowQuestions(true);
  };

  const reset = () => {
    setMessages([{ type: "bot", content: WELCOME }]);
    setShowQuestions(true);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={toggle}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6 -scale-x-100" />
            <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-destructive border-2 border-background" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border bg-background shadow-xl sm:w-[380px]"
            style={{ height: "min(520px, calc(100vh - 6rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl bg-accent px-4 py-3 text-accent-foreground">
              <span className="font-semibold text-sm">Aspen Montessori</span>
              <div className="flex items-center gap-1">
                <button onClick={reset} className="rounded-full p-1 hover:bg-accent-foreground/20 transition-colors" aria-label="Reset chat">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={toggle} className="rounded-full p-1 hover:bg-accent-foreground/20 transition-colors" aria-label="Close chat">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                        msg.type === "user"
                          ? "bg-accent text-accent-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                      {...(msg.isHtml ? { dangerouslySetInnerHTML: { __html: msg.content } } : { children: msg.content })}
                    />
                  </div>
                ))}

                {/* Quick-reply questions */}
                {showQuestions && (
                  <div className="flex flex-col gap-2 pt-1">
                    {chatbotQA.map((qa, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-2 text-xs whitespace-normal"
                        onClick={() => handleQuestion(i)}
                      >
                        {qa.question}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto py-2 text-xs text-muted-foreground"
                      onClick={handleOtherQuery}
                    >
                      I have another question
                    </Button>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}