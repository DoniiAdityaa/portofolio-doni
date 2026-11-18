"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type CountUpProps = {
  value: number;
  /** Digits after the decimal point. */
  decimals?: number;
  locale: string;
};

/** A number that counts up from zero the first time it scrolls into view. */
export function CountUp({ value, decimals = 0, locale }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const format = (number: number) =>
    number.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  useEffect(() => {
    const element = ref.current;
    if (!element || !inView || reduceMotion) return;

    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        element.textContent = format(latest);
      },
    });
    return () => controls.stop();
    // `format` only depends on locale and decimals, already listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, value, locale, decimals]);

  return <span ref={ref}>{format(value)}</span>;
}
