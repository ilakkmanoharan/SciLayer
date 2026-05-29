import { readFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSubmission, getSubmissionFilePath } from "@/lib/submissions/store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string; filename: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id, filename } = await context.params;
  const submission = await getSubmission(id);

  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const file = submission.files.find((f) => f.storedName === filename);
  if (!file) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  if (file.githubRawUrl) {
    return NextResponse.redirect(file.githubRawUrl);
  }

  try {
    const buffer = await readFile(getSubmissionFilePath(id, filename));
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `inline; filename="${file.originalName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not available on server." }, { status: 404 });
  }
}
