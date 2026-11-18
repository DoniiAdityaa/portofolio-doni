"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Milliseconds before typing starts. */
  startDelay?: number;
};

/**
 * Types the text one character at a time, with a blinking caret.
 * Screen readers and reduced-motion visitors get the full text immediately.
 */
export function Typewriter({ text, speed = 55, startDelay = 300 }: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let index = 0;
    let timer = window.setTimeout(function typeNext() {
      index += 1;
      setCount(index);
      if (index < text.length) timer = window.setTimeout(typeNext, speed);
    }, startDelay);

    return () => window.clearTimeout(timer);
  }, [text, speed, startDelay, reduceMotion]);

  const visible = reduceMotion ? text : text.slice(0, count);

  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {visible}
        <span className="ml-0.5 inline-block w-[0.08em] animate-pulse bg-primary align-baseline">
          &nbsp;
        </span>
      </span>
    </span>
  );
}
