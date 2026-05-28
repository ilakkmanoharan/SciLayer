export const submissionInstructions = `To submit a manuscript to SciLayer:

1. Log in using your ORCID iD.
2. Fork or clone the official SciLayer submissions repository.
3. Create a new folder using this format:

   submissions/YYYY/author-lastname-short-title/

4. Add the following files:

   manuscript.md
   metadata.yml
   references.bib
   figures/
   supplementary/

5. Write your manuscript in Markdown.
6. Commit your changes.
7. Push to GitHub.
8. Open a pull request or submit your GitHub repository URL in SciLayer.
9. SciLayer will validate, classify, and route your paper for review.
10. Once approved, your manuscript will be published as a SciLayer article.`;

export const metadataExample = `title: "Adaptive Scientific Reasoning Architecture"
short_title: "ASRA"
article_type: "preprint"
journal_target: "SciLayer Systems"
authors:
  - name: "Ilakkuvaselvi Manoharan"
    orcid: "0000-0000-0000-0000"
    affiliation: "Independent Researcher"
    email: "author@example.com"
abstract: |
  This paper introduces...
keywords:
  - adaptive reasoning
  - scientific discovery
  - world models
  - intervention learning
subjects:
  - Artificial Intelligence
  - Scientific Computing
  - Complex Systems
license: "CC-BY-4.0"
review_preference: "open"
github_repo: "https://github.com/scilayer/submissions"
github_branch: "main"
corresponding_author_orcid: "0000-0000-0000-0000"`;
