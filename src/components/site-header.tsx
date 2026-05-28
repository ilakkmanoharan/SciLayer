import Link from "next/link";

const navItems = [
  { href: "/articles", label: "Articles" },
  { href: "/journals", label: "Journals" },
  { href: "/submit", label: "Submit" },
  { href: "/search", label: "Search" },
  { href: "/reviewer", label: "Reviewer" },
  { href: "/editor", label: "Editor" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-950">
          SciLayer
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
          >
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
