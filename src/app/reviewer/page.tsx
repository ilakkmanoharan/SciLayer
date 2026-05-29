import { PageShell } from "@/components/page-shell";
import { ReviewerInvitationList } from "@/components/reviewer-invitation-list";
import { getReviewerInvitations } from "@/lib/reviewer-invitations";

export default async function ReviewerDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ invited?: string; declined?: string }>;
}) {
  const params = await searchParams;
  const invitations = await getReviewerInvitations();

  return (
    <PageShell
      eyebrow="Reviewer dashboard"
      title="Review invitations"
      description="Accept invitations, then open the review workspace to read the uploaded manuscript, cover letter, and supplementary materials."
    >
      {params?.invited ? (
        <div className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
          <p className="font-bold">New review invitation</p>
          <p className="mt-1">
            A manuscript has been submitted for review. Accept the invitation below to view the
            uploaded files.
          </p>
        </div>
      ) : null}

      {params?.declined ? (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Invitation declined.
        </div>
      ) : null}

      <ReviewerInvitationList invitations={invitations} highlightId={params?.invited} />
    </PageShell>
  );
}
