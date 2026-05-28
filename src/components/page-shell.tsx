import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </main>
  );
}
