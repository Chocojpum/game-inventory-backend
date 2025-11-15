export class Game {
  id: string;
  title: string;
  alternateTitles?: string[];
  coverArt: string;
  releaseDate: string;
  consoleFamilyId: string; // Reference to Console Family (e.g., "PlayStation 5")
  consoleId?: string; // Reference to owned Console instance
  developer: string;
  region: string;
  physicalDigital: 'physical' | 'digital';
  customAttributes: Record<string, any>;
  categoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
}