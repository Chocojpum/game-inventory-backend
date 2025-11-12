export class Category {
    id: string;
    name: string;
    type: 'franchise' | 'saga' | 'genre' | 'custom';
    description?: string;
    createdAt: Date;
  }