import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIPayment, PaymentsTable } from "../Drizzle/schema";
//

export const createPaymentService = async (payment: TIPayment) => {
  const [createdPayment] = await db
    .insert(PaymentsTable)
    .values(payment)
    .returning();
  return createdPayment;
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

export const getPaymentsByCustomerService = async (customerId: number) => {
  return await db
    .select()
    .from(PaymentsTable)
    .where(eq(PaymentsTable.customerID, customerId));
};
