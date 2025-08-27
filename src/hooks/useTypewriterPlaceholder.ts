// put this somewhere reusable, e.g. hooks/useTypewriterPlaceholder.ts
import { useEffect, useRef, useState } from "react";

type Opts = {
  typingSpeed?: number;     // ms per character while typing
  deletingSpeed?: number;   // ms per character while deleting
  pauseMs?: number;         // pause at full word
  active?: boolean;         // allow pausing from parent
};

export function useTypewriterPlaceholder(
  phrases: string[],
  {
    typingSpeed = 60,
    deletingSpeed = 40,
    pauseMs = 1100,
    active = true,
  }: Opts = {}
) {
  const [text, setText] = useState("");
  const iRef = useRef(0);          // index in phrases
  const delRef = useRef(false);    // deleting mode
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || phrases.length === 0) {
      // stop animation immediately
      if (tRef.current) window.clearTimeout(tRef.current);
      tRef.current = null;
      return;
    }

    const current = phrases[iRef.current % phrases.length];

    const step = () => {
      if (!delRef.current) {
        // typing
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          delRef.current = true;
          tRef.current = window.setTimeout(step, pauseMs);
        } else {
          tRef.current = window.setTimeout(step, typingSpeed);
        }
      } else {
        // deleting
        const next = current.slice(0, Math.max(0, text.length - 1));
        setText(next);
        if (next.length === 0) {
          delRef.current = false;
          iRef.current = (iRef.current + 1) % phrases.length;
          tRef.current = window.setTimeout(step, typingSpeed);
        } else {
          tRef.current = window.setTimeout(step, deletingSpeed);
        }
      }
    };

    tRef.current = window.setTimeout(step, typingSpeed);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [active, phrases, typingSpeed, deletingSpeed, pauseMs, text]);

  return text;
}
