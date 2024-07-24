import { Inject, Injectable } from "@nestjs/common";
import { isAfter, isBefore } from "date-fns";
import { DRIZZLE, Database } from "src/db";

@Injectable()
export class AdminService {
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async getDashboardStats() {
    const bills = await this.drizzle.query.bills.findMany({
      columns: {
        amountDue: true,
        dueDate: true,
      },
      with: {
        billType: {
          columns: {
            name: true,
          },
          with: {
            discounts: {
              columns: {
                name: true,
                amount: true,
              },
            },
          },
        },
        payments: {
          columns: {
            status: true,
            amount: true,
          },
          with: {
            type: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    });

    const totalBillsIssued = bills.reduce((acc, bill) => {
      return acc + Number(bill.amountDue);
    }, 0);

    const totalPaidBills = bills.reduce((acc, bill) => {
      return (
        acc +
        bill.payments.reduce((acc, payment) => {
          return acc + (payment.status === "paid" ? payment.amount : 0);
        }, 0)
      );
    }, 0);

    const totalDiscountsIssued = bills.reduce((acc, bill) => {
      return (
        acc +
        bill.billType.discounts.reduce((acc, discount) => {
          return acc + discount.amount;
        }, 0)
      );
    }, 0);
    return {
      success: true,
      message: "Dashboard stats found",
      data: {
        totalBillsIssued,
        totalPaidBills,
        totalOverDueBills: bills
          .filter(bill => {
            return isAfter(new Date(), bill.dueDate);
          })
          .reduce((acc, bill) => {
            return (
              acc +
              (bill.amountDue -
                bill.payments
                  .filter(x => x.status === "paid")
                  .map(payment => payment.amount)
                  .reduce((acc, x) => acc + x, 0)) -
              (bill.billType.discounts.reduce(
                (acc, discount) => acc + discount.amount,
                0,
              ) ?? 0)
            );
          }, 0),
        totalUnpaidBills:
          totalBillsIssued - totalPaidBills - totalDiscountsIssued,
        totalDiscountsIssued,
      },
    };
  }
}
