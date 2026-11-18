import { cn } from "@/lib/utils/cn";

type CodeTagProps = {
  children: string;
  className?: string;
};

/** A tech tag styled like a JSX element, e.g. `<flutter />` (Case 01 playful detail). */
export function CodeTag({ children, className }: CodeTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-teal/10 px-2 py-0.5 font-mono text-xs text-teal",
        className,
      )}
    >
      <span aria-hidden="true">&lt;</span>
      {children}
      <span aria-hidden="true">&nbsp;/&gt;</span>
    </span>
  );
}
