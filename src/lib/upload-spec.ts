/** Upload field specs from specs-journal/docs-upload.md */

export const uploadFields = {
  manuscript: {
    label: "Manuscript file",
    required: true,
    accept: ".pdf,.doc,.docx,.tex,.zip",
    maxMb: 200,
    hint: "Primary manuscript: PDF, Word, LaTeX, or ZIP.",
  },
  manuscriptPdf: {
    label: "PDF version",
    required: false,
    accept: ".pdf",
    maxMb: 200,
    hint: "Optional separate PDF if main file is Word or LaTeX.",
  },
  graphicAbstract: {
    label: "Graphic abstract",
    required: false,
    accept: ".png,.jpg,.jpeg,.webp,.tiff",
    maxMb: 20,
    hint: "Visual summary for discovery (optional).",
  },
  figuresTables: {
    label: "Figures and tables",
    required: false,
    accept: ".zip,.pdf,.doc,.docx",
    maxMb: 200,
    hint: "Separate figures/tables if not embedded in manuscript.",
  },
  supplementary: {
    label: "Supplementary file",
    required: false,
    accept: ".zip,.pdf,.doc,.docx",
    maxMb: 200,
    hint: "Appendix, extended methods, or supplementary tables.",
  },
} as const;

export type UploadFieldKey = keyof typeof uploadFields;

export function maxBytesForField(key: UploadFieldKey) {
  return uploadFields[key].maxMb * 1024 * 1024;
}
