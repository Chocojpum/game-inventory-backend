export class Peripheral {
    id: string;
    name: string;
    consoleId: string; // Reference to Console
    quantity: number;
    color: string;
    customAttributes: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }