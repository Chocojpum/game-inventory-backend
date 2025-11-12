import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  type: 'franchise' | 'saga' | 'genre' | 'custom';

  @IsOptional()
  @IsString()
  description?: string;
}