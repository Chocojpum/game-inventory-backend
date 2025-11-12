import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateAttributeDto {
    @IsString()
    name: string;
  
    @IsString()
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  
    @IsOptional()
    @IsArray()
    options?: string[];
  
    @IsOptional()
    isGlobal?: boolean;
  }