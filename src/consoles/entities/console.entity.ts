export class Console {
  id: string;
  consoleFamilyId: string; // Reference to Console Family
  releaseDate: string;
  picture: string;
  region: string;
  color: string;
  model: string;
  customAttributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}