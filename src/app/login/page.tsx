import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { hasOrcidCredentials } from "@/lib/orcid";

const errorMessages: Record<string, string> = {
  invalid_oauth_state: "The ORCID login session expired. Please try signing in again.",
  orcid_exchange_failed:
    "SciLayer could not complete the ORCID sign-in. Check that the redirect URI in your ORCID application matches this site.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const orcidReady = hasOrcidCredentials();
  const error = params?.error ? errorMessages[params.error] : null;

  return (
    <PageShell
      eyebrow="Account"
      title="Log in to SciLayer"
      description="Access your author dashboard, track submissions, manage reviews, and follow the publication status of your scientific papers."
    >
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Researcher access</h2>
        <p className="mt-3 text-slate-600">
          Sign in to submit manuscripts, view decisions, update author details, and
          continue work on papers already in review.
        </p>
        {!orcidReady ? (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-bold">ORCID sign-in is not configured on this machine yet.</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                Register an app at{" "}
                <a
                  href="https://orcid.org/developer-tools"
                  className="font-semibold underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  orcid.org/developer-tools
                </a>
                .
              </li>
              <li>
                Set the redirect URI to{" "}
                <code className="rounded bg-amber-100 px-1">
                  http://localhost:3000/api/orcid/callback
                </code>
                .
              </li>
              <li>
                Paste your client ID and secret into <code>.env.local</code>, then restart{" "}
                <code>npm run dev</code>.
              </li>
            </ol>
          </div>
        ) : null}
        {error ? (
          <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-900">
            {error}
          </p>
        ) : null}
        <Link
          href="/api/orcid/login"
          aria-disabled={!orcidReady}
          className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-bold text-white ${
            orcidReady
              ? "bg-slate-950 hover:bg-slate-800"
              : "pointer-events-none bg-slate-400"
          }`}
        >
          Continue with ORCID iD
        </Link>
      </div>
    </PageShell>
  );
}
