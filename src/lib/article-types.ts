/** Article types for SciLayer submission (from specs-journal/article-type.md) */

export const primaryArticleTypes = ["Article", "Review", "Systematic Review"] as const;

export const specializedArticleTypes = [
  "Brief Report",
  "Case Report",
  "Communication",
  "Concept Paper",
  "Data Descriptor",
  "Dataset",
  "Essay",
  "Hypothesis",
  "Opinion",
  "Perspective",
  "Protocol",
  "Project Report",
  "Registered Report",
  "Technical Note",
] as const;

export const additionalArticleTypes = [
  "Brief Communication",
  "Commentary",
  "Editorial",
  "Letter",
  "Study Protocol",
  "Book Review",
  "Proceeding Paper",
  "Abstract",
] as const;

export const allArticleTypes = [
  ...primaryArticleTypes,
  ...specializedArticleTypes,
  ...additionalArticleTypes,
] as const;

export type ArticleType = (typeof allArticleTypes)[number];
