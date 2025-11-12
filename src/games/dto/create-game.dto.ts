import { IsString, IsOptional, IsArray, IsObject, IsDateString, IsEnum } from 'class-validator';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  alternateTitles?: string[];

  @IsString()
  coverArt: string;

  @IsDateString()
  releaseDate: string;

  @IsString()
  platform: string;

  @IsOptional()
  @IsString()
  consoleId?: string;

  @IsEnum(['physical', 'digital'])
  physicalDigital: 'physical' | 'digital';

  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  categoryIds?: string[];
}

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  alternateTitles?: string[];

  @IsOptional()
  @IsString()
  coverArt?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  consoleId?: string;

  @IsOptional()
  @IsEnum(['physical', 'digital'])
  physicalDigital?: 'physical' | 'digital';

  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  categoryIds?: string[];
}