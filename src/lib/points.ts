export const pointValues = {
  submitValidManuscript: 10,
  publishPreprint: 25,
  journalAcceptance: 100,
  uploadDataset: 20,
  uploadCode: 20,
  reviewerCompletesReview: 30,
  articleReceivesCitation: 10,
  articleReceives100Views: 5,
  articleReceives100Downloads: 10,
  authorUpdatesArticleVersion: 5,
  editorApproval: 20,
} as const;

export type PointEventType = keyof typeof pointValues;

export function awardPoints(eventType: PointEventType) {
  return {
    eventType,
    points: pointValues[eventType],
    createdAt: new Date().toISOString(),
  };
}
