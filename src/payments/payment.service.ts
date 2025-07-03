import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIPayment, PaymentsTable } from "../Drizzle/schema";
//
export const createPaymentService = async (payment: TIPayment) => {
  await db.insert(PaymentsTable).values(payment).returning();
  return "Payment added successfully";
};

export const getPaymentService = async () => {
  const payments = await db.select().from(PaymentsTable);
  return payments;
};

export const getPaymentByIdService = async (id: number) => {
  const payment = await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.paymentID, id),
  });
  return payment;
};
export const updatePaymentService = async (id: number, payment: TIPayment) => {
  await db
    .update(PaymentsTable)
    .set(payment)
    .where(eq(PaymentsTable.paymentID, id))
    .returning();
  return "Payment updated successfully";
};

export const deletePaymentService = async (id: number) => {
  const deleted = await db
    .delete(PaymentsTable)
    .where(eq(PaymentsTable.paymentID, id))
    .returning();
  return deleted[0];
};

// export const PaymentsTable = pgTable("payments", {
//   paymentID: serial("paymentID").primaryKey(),
//   customerID: integer("customerID")
//     .notNull()
//     .references(() => CustomersTable.customerID, { onDelete: "cascade" }),
//   bookingID: integer("bookingID")
//     .notNull()
//     .references(() => BookingsTable.bookingID, { onDelete: "cascade" }),
//   // ... rest of fields
// });
