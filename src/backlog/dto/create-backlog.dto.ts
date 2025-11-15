import { IsDateString, IsObject, IsOptional, IsString } from "class-validator";

export class CreateBacklogDto {
  @IsString()
  gameId: string;

  @IsOptional()
  @IsDateString()
  completionDate: string | null;

  @IsString()
  endingType: string;

  @IsString()
  completionType: string;

  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;
}

export class UpdateBacklogDto {
  @IsOptional()
  @IsDateString()
  completionDate: string;

  @IsOptional()
  @IsString()
  endingType?: string;

  @IsOptional()
  @IsString()
  completionType?: string;

  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;
}