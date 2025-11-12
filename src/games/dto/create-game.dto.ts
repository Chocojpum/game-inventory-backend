import { IsString, IsOptional, IsArray, IsObject, IsDateString } from 'class-validator';

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
    @IsObject()
    customAttributes?: Record<string, any>;
  
    @IsOptional()
    @IsArray()
    categoryIds?: string[];
  }