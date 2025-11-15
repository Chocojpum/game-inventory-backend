export class Backlog {
  id: string;
  gameId: string;
  completionDate: string | null; // Allow null for unknown dates
  endingType: string;
  completionType: string;
  customAttributes: Record<string, any>;
  createdAt: Date;
}