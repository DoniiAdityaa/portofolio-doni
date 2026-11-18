import ReactMarkdown from "react-markdown";

/**
 * Renders admin-written Markdown (Case 02 §1). Raw HTML is never rendered,
 * so case-study text cannot inject scripts.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 leading-relaxed text-muted-foreground">
      <ReactMarkdown
        skipHtml
        components={{
          p: ({ children }) => <p>{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1.5 pl-5 marker:text-primary">{children}</ol>
          ),
          code: ({ children }) => (
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-teal">
              {children}
            </code>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
