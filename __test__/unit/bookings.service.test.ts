import {
  createBookingService,
  getBookingService,
  getBookingByIdService,
  getBookingsByCustomerIdService,
  updateBookingService,
  deleteBookingService,
} from "../../src/bookings/bookings.service";
import db from "../../src/Drizzle/db";
import { BookingsTable, TIBooking, TSBooking } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    BookingsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Bookings Service", () => {
  describe("createBookingService", () => {
    it("should insert a booking and return the inserted booking", async () => {
      const booking: TIBooking = {
        bookingID: 101,
        customerID: 1,
        eventID: 2,
        totalAmount: "10000.00",
        numberOfTickets: 4,
        bookingDate: "2024-11-01T10:00:00.000Z",
        bookingStatus: "Confirmed",
        createdAt: "2024-11-01T10:05:00.000Z",
        updatedAt: "2024-11-01T10:10:00.000Z",
      };

      const insertedBooking: TSBooking = {
        bookingID: 1,
        customerID: booking.customerID,
        eventID: booking.eventID,
        totalAmount: booking.totalAmount,
        numberOfTickets: booking.numberOfTickets ?? 0,
        bookingDate: booking.bookingDate ?? null,
        bookingStatus: booking.bookingStatus ?? null,
        createdAt: "2024-07-09T10:00:00Z",
        updatedAt: "2024-07-09T10:00:00Z",
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([insertedBooking]),
        }),
      });

      const result = await createBookingService(booking);
      expect(db.insert).toHaveBeenCalledWith(BookingsTable);
      expect(result).toEqual(insertedBooking);
    });
  });

  describe("getBookingService", () => {
    it("should return all bookings", async () => {
      const bookings: TSBooking[] = [
        {
          bookingID: 101,
          customerID: 1,
          eventID: 2,
          totalAmount: "10000.00",
          numberOfTickets: 4,
          bookingDate: "2024-11-01T10:00:00.000Z",
          bookingStatus: "Confirmed",
          createdAt: "2024-11-01T10:05:00.000Z",
          updatedAt: "2024-11-01T10:10:00.000Z",
        },
        {
          bookingID: 103,
          customerID: 2,
          eventID: 3,
          totalAmount: "8000.00",
          numberOfTickets: 2,
          bookingDate: "2024-12-10T09:30:00.000Z",
          bookingStatus: "Cancelled",
          createdAt: "2024-12-10T09:31:00.000Z",
          updatedAt: "2024-12-10T09:45:00.000Z",
        },
      ];

      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce(
        bookings
      );

      const result = await getBookingService();
      expect(db.query.BookingsTable.findMany).toHaveBeenCalled();
      expect(result).toEqual(bookings);
    });

    it("should return empty array when no bookings exist", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getBookingService();
      expect(result).toEqual([]);
    });
  });

  describe("getBookingByIdService", () => {
    it("should return booking by ID", async () => {
      const booking: TSBooking = {
        bookingID: 101,
        customerID: 1,
        eventID: 2,
        totalAmount: "10000.00",
        numberOfTickets: 4,
        bookingDate: "2024-11-01T10:00:00.000Z",
        bookingStatus: "Confirmed",
        createdAt: "2024-11-01T10:05:00.000Z",
        updatedAt: "2024-11-01T10:10:00.000Z",
      };

      (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(
        booking
      );

      const result = await getBookingByIdService(1);
      expect(db.query.BookingsTable.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(result).toEqual(booking);
    });

    it("should return undefined when booking is not found", async () => {
      (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(
        undefined
      );

      const result = await getBookingByIdService(999);
      expect(result).toBeUndefined();
    });
  });

  describe("getBookingsByCustomerIdService", () => {
    it("should return bookings for a specific customer", async () => {
      const customerBookings: TSBooking[] = [
        {
          bookingID: 101,
          customerID: 1,
          eventID: 2,
          totalAmount: "10000.00",
          numberOfTickets: 4,
          bookingDate: "2024-11-01T10:00:00.000Z",
          bookingStatus: "Confirmed",
          createdAt: "2024-11-01T10:05:00.000Z",
          updatedAt: "2024-11-01T10:10:00.000Z",
        },
        {
          bookingID: 13,
          customerID: 1,
          eventID: 2,
          totalAmount: "10000.00",
          numberOfTickets: 4,
          bookingDate: "2024-11-01T10:00:00.000Z",
          bookingStatus: "Confirmed",
          createdAt: "2024-11-01T10:05:00.000Z",
          updatedAt: "2024-11-01T10:10:00.000Z",
        },
      ];

      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce(
        customerBookings
      );

      const result = await getBookingsByCustomerIdService(1);
      expect(db.query.BookingsTable.findMany).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(result).toEqual(customerBookings);
    });

    it("should return empty array when customer has no bookings", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getBookingsByCustomerIdService(999);
      expect(result).toEqual([]);
    });
  });

  describe("updateBookingService", () => {
    it("should update booking and return success message", async () => {
      const updatedBooking: TIBooking = {
        bookingID: 101,
        customerID: 1,
        eventID: 2,
        totalAmount: "10000.00",
        numberOfTickets: 4,
        bookingDate: "2024-11-01T10:00:00.000Z",
        bookingStatus: "Confirmed",
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValueOnce(undefined),
        }),
      });

      const result = await updateBookingService(1, updatedBooking);
      expect(db.update).toHaveBeenCalledWith(BookingsTable);
      expect(result).toBe("Booking updated successfully");
    });
  });

  describe("deleteBookingService", () => {
    it("should delete booking and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(undefined),
      });

      const result = await deleteBookingService(1);
      expect(db.delete).toHaveBeenCalledWith(BookingsTable);
      expect(result).toBe("Booking deleted successfully");
    });

    it("should handle deletion of non-existent booking", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(undefined),
      });

      const result = await deleteBookingService(999);
      expect(result).toBe("Booking deleted successfully");
    });
  });
});
