import { IsString, IsOptional } from 'class-validator';

export class CreateConsoleFamilyDto {
  @IsString()
  name: string;

  @IsString()
  developer: string;

  @IsOptional()
  @IsString()
  generation?: string;
}