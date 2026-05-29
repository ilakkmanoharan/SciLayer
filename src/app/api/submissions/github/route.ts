import { NextResponse } from "next/server";

/** @deprecated Authors upload via POST /api/submissions/upload; SciLayer archives to GitHub. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "GitHub URL submission is no longer supported. Upload your manuscript packet at /submissions/upload.",
      redirect: "/submissions/upload",
    },
    { status: 410 },
  );
}
