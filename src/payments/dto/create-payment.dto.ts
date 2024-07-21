export class CreatePaymentDto {
  billId: number;
  payerId: bigint;
  paymentTypeId: number;
  paymentReference: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentNote: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
