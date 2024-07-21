import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateBillDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  amountDue: number;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsBoolean()
  @IsNotEmpty()
  installmentSupported: boolean;

  @IsNumber()
  @IsNotEmpty()
  maxInstallments: number;

  @IsNumber()
  @IsNotEmpty()
  billTypeId: number;
}
