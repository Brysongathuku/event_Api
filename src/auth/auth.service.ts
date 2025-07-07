import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TICustomer, CustomersTable, TSCustomer } from "../Drizzle/schema";

//register a customer
export const createCustomerService = async (user: TICustomer) => {
  await db.insert(CustomersTable).values(user);
  return "Customer added successfully";
};

export const verifyCustomerService = async (email: string) => {
  await db
    .update(CustomersTable)
    .set({ isVerified: true, verificationCode: null })
    .where(sql`${CustomersTable.email} = ${email}`);
};

export const customerLoginService = async (customer: TSCustomer) => {
  const { email } = customer; //extracts email property from customer

  return await db.query.CustomersTable.findFirst({
    columns: {
      customerID: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
    },
    where: sql`${CustomersTable.email} = ${email}`,
  });
};

// export const getCustomerWithBookingsAndPaymentsService = async (id: number) => {
//     return await db.query.CustomersTable.findFirst({
//         where: eq(CustomersTable.customerID, id),
//         columns: {
//             firstName: true,
//             lastName: true
//         },
//         with: {
//             bookings: {
//                 columns: {
//                     bookingID: true,
//                     rentalStartDate: true,
//                     rentalEndDate: true,
//                     totalAmount: true
//                 },
//                 with: {
//                     payments: true
//                 }
//             }
//         }
//     });
// };

// // get all customers with selected booking properties and their payments
// export const getAllCustomersWithBookingsAndPaymentsService = async () => {
//     return await db.query.CustomersTable.findMany({
//         columns: {
//             firstName: true,
//             lastName: true
//         },
//         with: {
//             bookings: {
//                 columns: {
//                     bookingID: true,
//                     rentalStartDate: true,
//                     rentalEndDate: true,
//                     totalAmount: true
//                 },
//                 with: {
//                     payments: true
//                 }
//             }
//         }
//     });
// };
// get all customers
export const getCustomerService = async () => {
  const customers = await db.query.CustomersTable.findMany();
  return customers;
};

// get customer by id
export const getCustomerByIdService = async (id: number) => {
  const customer = await db.query.CustomersTable.findFirst({
    where: eq(CustomersTable.customerID, id),
  });
  return customer;
};
//get customer by email
export const getCustomerByEmailService = async (email: string) => {
  return await db.query.CustomersTable.findFirst({
    where: sql`${CustomersTable.email} = ${email}`,
  });
};

// update customer by id
export const updateCustomerService = async (
  id: number,
  customer: TICustomer
) => {
  await db
    .update(CustomersTable)
    .set(customer)
    .where(eq(CustomersTable.customerID, id))
    .returning();
  return "Customer updated successfully";
};

// delete customer by id
export const deleteCustomerService = async (id: number) => {
  await db
    .delete(CustomersTable)
    .where(eq(CustomersTable.customerID, id))
    .returning();
  return "Customer deleted successfully";
};
