import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFinancialAidDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  billTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  financialAidTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
