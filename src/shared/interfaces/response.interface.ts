import { OmitType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Authorization, Customer, Log } from "./webhooks";

export class Response<T> {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  message: string;
  @ApiPropertyOptional()
  data: T;
}

export class ResponseWithNoData extends OmitType(Response<null>, [
  "data",
] as const) {
  @ApiProperty()
  override success: boolean;

  @ApiProperty()
  override message: string;
}

export type ResponseWithOptionalData<T> = Response<T> | ResponseWithNoData;

export class ValidationError {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string[];
  @ApiProperty()
  error: string;
}

export const data = <X>(value: Response<X> | ResponseWithNoData): X | null =>
  (value as Response<X>)?.data;

export type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type TransactionStatus =
  | "abandoned"
  | "failed"
  | "ongoing"
  | "pending"
  | "processing"
  | "queued"
  | "reversed"
  | "success";

export interface VerifyTransactionResponse {
  id: number;
  domain: string;
  status: TransactionStatus;
  reference: string;
  amount: number;
  message: any;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: string;
  log: Log;
  fees: number;
  fees_split: any;
  authorization: Authorization;
  customer: Customer;
  plan: any;
  split: Split;
  order_id: any;
  paidAt: string;
  createdAt: string;
  requested_amount: number;
  pos_transaction_data: any;
  source: any;
  fees_breakdown: any;
  transaction_date: string;
  plan_object: PlanObject;
  subaccount: Subaccount;
}

export interface Split {}

export interface PlanObject {}

export interface Subaccount {}
