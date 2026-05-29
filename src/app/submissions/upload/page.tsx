import { PageShell } from "@/components/page-shell";
import { ManuscriptUploadForm } from "@/components/manuscript-upload-form";

export default function ManuscriptUploadPage() {
  return (
    <PageShell
      eyebrow="Manuscript upload"
      title="Upload your manuscript packet"
      description="Select article type, upload required and optional files, and submit. SciLayer validates your packet and archives it to the SciLayer GitHub repository."
    >
      <ManuscriptUploadForm />
    </PageShell>
  );
}
