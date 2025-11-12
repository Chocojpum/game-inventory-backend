import { IsObject, IsOptional, IsString } from "class-validator";

export class CreatePeripheralDto {
    @IsString()
    name: string;
  
    @IsString()
    consoleId: string;
  
    @IsOptional()
    quantity?: number;
  
    @IsString()
    color: string;
  
    @IsOptional()
    @IsObject()
    customAttributes?: Record<string, any>;
  }
  
  export class UpdatePeripheralDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    consoleId?: string;
  
    @IsOptional()
    quantity?: number;
  
    @IsOptional()
    @IsString()
    color?: string;
  
    @IsOptional()
    @IsObject()
    customAttributes?: Record<string, any>;
  }