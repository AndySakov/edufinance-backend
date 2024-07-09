import { ApiProperty } from "@nestjs/swagger";
import * as t from "io-ts";

export class PaginatedData<T> {
  public static readonly PaginatedDataType = <T>(
    type: t.Type<T>,
  ): t.Type<PaginatedData<T>> =>
    t.strict({
      page: t.number,
      count: t.number,
      total: t.number,
      data: t.array(type),
    });

  @ApiProperty()
  page: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  data: T[];
}
