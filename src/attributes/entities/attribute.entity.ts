export class Attribute {
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    options?: string[]; // For select type
    isGlobal: boolean; // If true, applies to all games
    createdAt: Date;
  }