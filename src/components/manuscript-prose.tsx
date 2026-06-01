type ManuscriptProseProps = {
  html: string;
};

/** Scholarly article body: typography, tables, math, code, and spacing. */
export function ManuscriptProse({ html }: ManuscriptProseProps) {
  return (
    <div
      className="manuscript-prose prose prose-slate prose-lg mt-10 max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
