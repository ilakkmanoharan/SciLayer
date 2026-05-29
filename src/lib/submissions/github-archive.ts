import type { ManuscriptSubmission } from "@/lib/submissions/types";

type ArchiveFile = {
  storedName: string;
  buffer: Buffer;
  mimeType: string;
};

export async function archiveSubmissionToGithub(
  submission: ManuscriptSubmission,
  files: ArchiveFile[],
) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.SCILAYER_SUBMISSIONS_REPO ?? "ilakkmanoharan/scilayer-submissions";

  if (!token) {
    return {
      archived: false,
      path: undefined,
      url: undefined,
    };
  }

  const year = new Date().getFullYear();
  const basePath = `submissions/${year}/${submission.slug}`;

  for (const file of files) {
    const content = file.buffer.toString("base64");
    const apiPath = `${basePath}/${file.storedName}`;

    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${apiPath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `SciLayer submission: ${submission.title} — ${file.storedName}`,
          content,
        }),
      },
    );

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`GitHub archive failed for ${file.storedName}: ${details}`);
    }

    const payload = (await response.json()) as { content?: { download_url?: string } };
    const match = submission.files.find((f) => f.storedName === file.storedName);
    if (match && payload.content?.download_url) {
      match.githubRawUrl = payload.content.download_url;
    }
  }

  const manifestJson = JSON.stringify(submission, null, 2);
  const manifestResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents/${basePath}/manifest.json`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `SciLayer submission manifest: ${submission.title}`,
        content: Buffer.from(manifestJson, "utf8").toString("base64"),
      }),
    },
  );

  if (!manifestResponse.ok) {
    const details = await manifestResponse.text();
    throw new Error(`GitHub manifest archive failed: ${details}`);
  }

  const metadataYaml = buildMetadataYaml(submission);
  const metadataResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents/${basePath}/metadata.yml`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `SciLayer submission metadata: ${submission.title}`,
        content: Buffer.from(metadataYaml, "utf8").toString("base64"),
      }),
    },
  );

  if (!metadataResponse.ok) {
    const details = await metadataResponse.text();
    throw new Error(`GitHub metadata archive failed: ${details}`);
  }

  const [owner, repoName] = repo.split("/");
  const url = `https://github.com/${owner}/${repoName}/tree/main/${basePath}`;

  return {
    archived: true,
    path: basePath,
    url,
  };
}

function buildMetadataYaml(submission: ManuscriptSubmission) {
  return `title: "${submission.title.replace(/"/g, '\\"')}"
article_type: "${submission.articleType}"
journal_target: "${submission.journalTarget}"
authors:
  - name: "${submission.authorName.replace(/"/g, '\\"')}"
    orcid: "${submission.authorOrcid}"
abstract: |
  ${submission.abstract}
keywords:
${submission.keywords.map((k) => `  - ${k}`).join("\n")}
submitted_at: "${submission.createdAt}"
scilayer_submission_id: "${submission.id}"
`;
}
