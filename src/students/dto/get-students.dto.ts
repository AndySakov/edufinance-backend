import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetStudentsDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 50;

  @ApiProperty()
  @IsOptional()
  @IsString()
  query?: string;
}
