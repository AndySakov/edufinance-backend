import { Type } from "class-transformer";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateStudentDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(["male", "female"])
  gender: "male" | "female";

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone(
    "en-NG",
    {
      strictMode: true,
    },
    {
      message: "Invalid phone number",
    },
  )
  phoneNumber: string;
}
