export type ReviewerEmailInput = {
  reviewerName: string;
  articleTitle: string;
  authors: string[];
  field: string;
  subfield: string;
  tags: string[];
  reviewLink: string;
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

Please use the secure link below to accept, decline, or submit your review:

${input.reviewLink}

Thank you,
SciLayer Editorial System`,
  };
}
