import { useEffect, useRef } from "react";

/**
 * Lightweight CSS-based scroll reveal using IntersectionObserver.
 * Adds 'data-revealed' attribute when element enters viewport.
 * Use with CSS classes: .reveal-fade-up, .reveal-scale-in
 */
export function useScrollReveal<T extends HTMLElement>(
  options?: { threshold?: number; once?: boolean }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-revealed", "true");
          if (options?.once !== false) observer.unobserve(el);
        }
      },
      { threshold: options?.threshold ?? 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.once]);

  return ref;
}
