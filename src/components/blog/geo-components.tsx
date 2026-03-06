interface TLDRBlockProps {
  children: React.ReactNode;
}

export function TLDRBlock({ children }: TLDRBlockProps) {
  return (
    <div className="bg-[var(--blog-accent-light)] border-l-4 border-[var(--blog-accent)] rounded-r-lg p-4 my-6">
      <p className="text-sm font-bold text-[var(--blog-accent)] mb-2">TL;DR</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

interface CitationBlockProps {
  source: string;
  url?: string;
  children: React.ReactNode;
}

export function CitationBlock({ source, url, children }: CitationBlockProps) {
  return (
    <blockquote className="border-l-4 border-[var(--blog-border)] bg-[var(--blog-card-bg)] rounded-r-lg p-4 my-6 not-italic">
      <div className="text-sm leading-relaxed">{children}</div>
      <footer className="mt-2 text-xs text-[var(--blog-text-muted)]">
        Source:{" "}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--blog-accent)] underline"
          >
            {source}
          </a>
        ) : (
          source
        )}
      </footer>
    </blockquote>
  );
}

interface ExpertQuoteProps {
  name: string;
  title: string;
  children: React.ReactNode;
}

export function ExpertQuote({ name, title, children }: ExpertQuoteProps) {
  return (
    <figure className="border border-[var(--blog-border)] rounded-lg p-5 my-6">
      <blockquote className="text-base italic leading-relaxed">
        {children}
      </blockquote>
      <figcaption className="mt-3 text-sm">
        <span className="font-semibold">{name}</span>
        <span className="text-[var(--blog-text-muted)]"> &mdash; {title}</span>
      </figcaption>
    </figure>
  );
}

interface DataTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export function DataTable({ headers, rows, caption }: DataTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {caption && (
          <caption className="text-xs text-[var(--blog-text-muted)] mb-2 text-left">
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border border-[var(--blog-border)] bg-[var(--blog-card-bg)] px-3 py-2 text-left font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-[var(--blog-border)] px-3 py-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

export function FAQItem({ question, children }: FAQItemProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    typeof children === "string"
                      ? children
                      : question,
                },
              },
            ],
          }),
        }}
      />
      <div className="my-4 border border-[var(--blog-border)] rounded-lg overflow-hidden">
        <div className="bg-[var(--blog-card-bg)] px-4 py-3">
          <h4 className="font-semibold text-base">{question}</h4>
        </div>
        <div className="px-4 py-3 text-sm leading-relaxed">{children}</div>
      </div>
    </>
  );
}

interface LastUpdatedProps {
  date: string;
}

export function LastUpdated({ date }: LastUpdatedProps) {
  return (
    <p className="text-xs text-[var(--blog-text-muted)] italic my-4">
      Last updated: {date}
    </p>
  );
}
