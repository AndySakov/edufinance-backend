import { getSchemaPath } from "@nestjs/swagger";
import {
  SchemaObject,
  ReferenceObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import ShortUniqueId from "short-unique-id";
import { PaginatedData } from "../interfaces";

export const responseSchemaWrapper = (
  child: SchemaObject | ReferenceObject,
): SchemaObject | ReferenceObject => {
  return {
    $ref: getSchemaPath(Response),
    properties: {
      success: {
        type: "boolean",
      },
      message: {
        type: "string",
      },
      data: child,
    },
  };
};

export const transformToNullIfUndefined = (
  value: unknown | undefined,
): unknown => {
  return value === undefined ? null : value;
};

export const paginate = <T>(
  page: number,
  limit: number,
  data: T[],
): PaginatedData<T> => {
  return {
    page: (data.length > 0 ? page ?? 1 : -1) ?? -1,
    count: limit > data.length ? data.length : limit,
    total: data.length,
    data: data.slice((page - 1) * limit, page * limit),
  };
};

export const randomToken = (): string => {
  const uid = new ShortUniqueId();
  const generate = uid.randomUUID(64);
  return generate;
};

export const obfuscate = (value: string | null): string | null => {
  if (value) {
    const lastFour = value.slice(-4);
    const firstFour = value.slice(0, 4);
    const middle = value.slice(4, -4).replace(/./g, "*");
    return `${firstFour}${middle}${lastFour}`;
  } else {
    return null;
  }
};
