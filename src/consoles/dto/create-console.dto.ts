import { IsDateString, IsObject, IsOptional, IsString } from "class-validator";

export class CreateConsoleDto {
  @IsString()
  consoleFamilyId: string;

  @IsDateString()
  releaseDate: string;

  @IsString()
  picture: string;

  @IsString()
  region: string;

  @IsString()
  color: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;
}

export class UpdateConsoleDto {
  @IsOptional()
  @IsString()
  consoleFamilyId?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;
}