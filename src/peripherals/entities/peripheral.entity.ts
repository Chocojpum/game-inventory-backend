export class Peripheral {
  id: string;
  name: string;
  consoleFamilyId: string; // Reference to Console Family
  quantity: number;
  color: string;
  picture: string;
  customAttributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}