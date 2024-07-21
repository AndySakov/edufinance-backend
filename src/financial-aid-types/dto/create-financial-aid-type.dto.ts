import { IsNotEmpty, IsString } from "class-validator";

export class CreateFinancialAidTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
