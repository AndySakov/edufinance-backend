import { bigint, foreignKey, mysqlTable } from "drizzle-orm/mysql-core";
import { financialAidApplications } from "./financial-aid-applications";
import { financialAidDiscounts } from "./financial-aid-discounts";
import { relations } from "drizzle-orm";

export const applicationsToDiscounts = mysqlTable(
  "applications_to_discounts",
  {
    applicationId: bigint("application_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    discountId: bigint("discount_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
  },
  table => {
    return {
      applicationReference: foreignKey({
        columns: [table.applicationId],
        foreignColumns: [financialAidApplications.id],
        name: "fk_applications_to_discounts_application_id",
      })
        .onDelete("cascade")
        .onUpdate("cascade"),
      discountReference: foreignKey({
        columns: [table.discountId],
        foreignColumns: [financialAidDiscounts.id],
        name: "fk_applications_to_discounts_discount_id",
      })
        .onDelete("cascade")
        .onUpdate("cascade"),
    };
  },
);

export const applicationsToDiscountsRelations = relations(
  applicationsToDiscounts,
  ({ one }) => ({
    application: one(financialAidApplications, {
      fields: [applicationsToDiscounts.applicationId],
      references: [financialAidApplications.id],
    }),
    discount: one(financialAidDiscounts, {
      fields: [applicationsToDiscounts.discountId],
      references: [financialAidDiscounts.id],
    }),
  }),
);

export type ApplicationsToDiscounts =
  typeof applicationsToDiscounts.$inferSelect;
export type NewApplicationsToDiscounts =
  typeof applicationsToDiscounts.$inferInsert;
