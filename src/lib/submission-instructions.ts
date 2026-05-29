export const submissionInstructions = `To submit a manuscript to SciLayer:

1. Log in using your ORCID iD.
2. Choose your article type (Article, Review, Concept Paper, and others).
3. Upload your manuscript packet directly to SciLayer:
   - Manuscript file (PDF, Word, LaTeX, or ZIP) — required
   - PDF version, graphic abstract, figures/tables, supplementary files — optional
   - Cover letter and related website links (repository, data, preprint)
4. SciLayer validates your upload and archives the packet to the SciLayer GitHub repository.
5. You do not commit files to GitHub yourself—SciLayer handles archival after upload.
6. SciLayer classifies your paper and routes it for peer review.
7. Reviewers access your uploaded manuscript and supporting files in the review workspace.
8. After approval, your article is published on SciLayer.`;

export const metadataExample = `title: "Adaptive Scientific Reasoning Architecture"
article_type: "Article"
journal_target: "SciLayer Systems"
authors:
  - name: "Ilakkuvaselvi Manoharan"
    orcid: "0009-0008-8073-5416"
abstract: |
  This paper introduces...
keywords:
  - adaptive reasoning
  - scientific discovery
license: "CC-BY-4.0"
review_preference: "open"
`;
