"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  /** Milliseconds per typed character. */
  typeSpeed?: number;
  /** Milliseconds per deleted character (deleting is faster than typing). */
  deleteSpeed?: number;
  /** How long the full text stays before it is deleted, in milliseconds. */
  holdDuration?: number;
  /** Pause on the empty line before typing again, in milliseconds. */
  restDuration?: number;
  /** Milliseconds before the first character appears. */
  startDelay?: number;
};

/**
 * Types the text, holds it, deletes it, and starts again — forever (CR-02).
 * Screen readers and reduced-motion visitors get the full, static text.
 */
export function Typewriter({
  text,
  typeSpeed = 70,
  deleteSpeed = 35,
  holdDuration = 2200,
  restDuration = 500,
  startDelay = 400,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let length = 0;
    let deleting = false;
    let timer: number;

    function step() {
      if (!deleting) {
        length += 1;
        setCount(length);
        if (length === text.length) {
          deleting = true;
          timer = window.setTimeout(step, holdDuration);
          return;
        }
        timer = window.setTimeout(step, typeSpeed);
        return;
      }

      length -= 1;
      setCount(length);
      if (length === 0) {
        deleting = false;
        timer = window.setTimeout(step, restDuration);
        return;
      }
      timer = window.setTimeout(step, deleteSpeed);
    }

    timer = window.setTimeout(step, startDelay);
    return () => window.clearTimeout(timer);
  }, [text, typeSpeed, deleteSpeed, holdDuration, restDuration, startDelay, reduceMotion]);

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
