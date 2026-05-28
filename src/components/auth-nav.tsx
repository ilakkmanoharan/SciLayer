import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user";

export async function AuthNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
      >
        Log in
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href="/dashboard" className="text-slate-600 hover:text-slate-950">
        Dashboard
      </Link>
      <span className="hidden text-sm text-slate-500 sm:inline">{user.name}</span>
      <form action="/api/auth/logout" method="post">
        <button
          type="submit"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:border-slate-950"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
