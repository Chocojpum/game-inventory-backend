import { IsString } from "class-validator";

export class CreateCompletionTypeDto {
    @IsString()
    name: string;
  }