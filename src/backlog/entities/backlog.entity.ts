export class Backlog {
    id: string;
    gameId: string;
    completionDate: string;
    endingType: string;
    completionType: string;
    customAttributes: Record<string, any>;
    createdAt: Date;
  }