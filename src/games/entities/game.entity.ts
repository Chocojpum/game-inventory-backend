export class Game {
    id: string;
    title: string;
    alternateTitles?: string[];
    coverArt: string;
    releaseDate: string;
    platform: string;
    customAttributes: Record<string, any>;
    categoryIds: string[];
    createdAt: Date;
    updatedAt: Date;
  }