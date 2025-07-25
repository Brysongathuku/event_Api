import db from "../Drizzle/db";
import { eq } from "drizzle-orm";
import { TIBooking, BookingsTable } from "../Drizzle/schema";

export const createBookingService = async (booking: TIBooking) => {
  const [inserted] = await db.insert(BookingsTable).values(booking).returning();
  return inserted;
};

export const getBookingService = async () => {
  const bookings = await db.query.BookingsTable.findMany();
  return bookings;
};

export const getBookingByIdService = async (id: number) => {
  const booking = await db.query.BookingsTable.findFirst({
    where: eq(BookingsTable.bookingID, id),
  });
  return booking;
};

export const getBookingsByCustomerIdService = async (customerId: number) => {
  const bookings = await db.query.BookingsTable.findMany({
    where: eq(BookingsTable.customerID, customerId),
  });
  return bookings;
};

export const updateBookingService = async (id: number, booking: TIBooking) => {
  await db
    .update(BookingsTable)
    .set(booking)
    .where(eq(BookingsTable.bookingID, id));
  return "Booking updated successfully";
};

export const deleteBookingService = async (id: number) => {
  const deleted = await db
    .delete(BookingsTable)
    .where(eq(BookingsTable.bookingID, id));
  return "Booking deleted successfully";
};
