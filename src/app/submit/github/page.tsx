import { PageShell } from "@/components/page-shell";
import { GithubSubmissionForm } from "@/components/github-submission-form";

export default function GithubSubmitPage() {
  return (
    <PageShell
      eyebrow="GitHub intake"
      title="Validate a manuscript submission"
      description="Submit a GitHub repository, branch, or pull request URL. The v0.1 flow validates the required manuscript structure, classifies the article, awards submission points, and previews reviewer notification email content."
    >
      <GithubSubmissionForm />
    </PageShell>
  );
}
