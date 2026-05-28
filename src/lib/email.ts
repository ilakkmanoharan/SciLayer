export type ReviewerEmailInput = {
  reviewerName: string;
  articleTitle: string;
  authors: string[];
  field: string;
  subfield: string;
  tags: string[];
  dashboardUrl: string;
};

export function buildReviewerInvitationEmail(input: ReviewerEmailInput) {
  return {
    subject: `Review Invitation for SciLayer Manuscript: ${input.articleTitle}`,
    body: `Hello ${input.reviewerName},

You have been invited to review a SciLayer manuscript:

Title: ${input.articleTitle}
Authors: ${input.authors.join(", ")}
Classification: ${input.field} / ${input.subfield}
Tags: ${input.tags.join(", ")}

Open your reviewer dashboard to accept or decline this invitation:

${input.dashboardUrl}

Thank you,
SciLayer Editorial System`,
  };
}
