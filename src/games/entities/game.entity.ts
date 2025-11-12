export class Game {
  id: string;
  title: string;
  alternateTitles?: string[];
  coverArt: string;
  releaseDate: string;
  platform: string;
  consoleId?: string; // Reference to Console
  physicalDigital: 'physical' | 'digital';
  customAttributes: Record<string, any>;
  categoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
}