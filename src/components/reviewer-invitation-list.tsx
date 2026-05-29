"use client";

import { useRouter } from "next/navigation";

export type ReviewerInvitationItem = {
  submissionId: string;
  slug: string;
  token: string;
  title: string;
  abstract: string;
  authors: string;
  articleType: string;
  status: "invited" | "accepted" | "declined";
};

export function ReviewerInvitationList({
  invitations,
  highlightId,
}: {
  invitations: ReviewerInvitationItem[];
  highlightId?: string;
}) {
  const router = useRouter();

  if (!invitations.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">No manuscript submissions yet. Upload a paper to begin review.</p>
        <a href="/submissions/upload" className="mt-4 inline-flex font-bold text-cyan-700 hover:underline">
          Submit a manuscript
        </a>
      </div>
    );
  }

  async function handleAction(
    invitation: ReviewerInvitationItem,
    action: "accept" | "decline",
  ) {
    await fetch(`/api/reviewer/invitations/${invitation.token}/${action}`, {
      method: "POST",
    });

    if (action === "accept") {
      router.push(`/reviewer/reviews/${invitation.submissionId}`);
      return;
    }

    router.push("/reviewer?declined=1");
    router.refresh();
  }

  return (
    <div className="grid gap-5">
      {invitations.map((invitation) => {
        const isHighlighted = highlightId === invitation.submissionId;

        return (
          <section
            key={invitation.submissionId}
            className={`rounded-3xl border bg-white p-6 shadow-sm ${
              isHighlighted ? "border-cyan-400 ring-2 ring-cyan-100" : "border-slate-200"
            }`}
          >
            {isHighlighted ? (
              <p className="mb-3 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-800">
                New invitation
              </p>
            ) : null}

            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              {invitation.status === "invited"
                ? "Invited"
                : invitation.status === "accepted"
                  ? "Accepted"
                  : "Declined"}{" "}
              · {invitation.articleType}
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{invitation.title}</h2>
            <p className="mt-1 text-sm text-slate-500">Authors: {invitation.authors}</p>
            <p className="mt-3 text-slate-600">{invitation.abstract}</p>

            {invitation.status === "invited" ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAction(invitation, "accept")}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Accept invitation
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(invitation, "decline")}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:border-slate-950"
                >
                  Decline invitation
                </button>
              </div>
            ) : invitation.status === "accepted" ? (
              <button
                type="button"
                onClick={() => router.push(`/reviewer/reviews/${invitation.submissionId}`)}
                className="mt-5 rounded-full bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-700"
              >
                Open review workspace
              </button>
            ) : (
              <p className="mt-5 text-sm font-medium text-slate-500">
                You declined this invitation.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
