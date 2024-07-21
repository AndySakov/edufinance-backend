import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InitiateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  billId: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  amount: string;
}
