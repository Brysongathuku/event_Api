import {
  createPaymentService,
  getPaymentService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
  getPaymentsByCustomerService,
} from "../../src/payments/payment.service";
import db from "../../src/Drizzle/db";
import { PaymentsTable, TIPayment, TSPayment } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    PaymentsTable: {
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Payment Service", () => {
  describe("createPaymentService", () => {
    it("should insert a payment and return success message", async () => {
      const payment: TIPayment = {
        paymentID: 1,
        customerID: 101,
        bookingID: 201,
        amount: "5000.00",
        paymentStatus: "Pending",
        paymentDate: "2024-07-01T08:30:00.000Z",
        paymentMethod: "M-Pesa",
        transactionID: "MPESA123456789",
        createdAt: "2024-07-01T08:31:00.000Z",
        updatedAt: "2024-07-01T08:31:00.000Z",
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockResolvedValueOnce([{}]),
      });

      const result = await createPaymentService(payment);
      expect(db.insert).toHaveBeenCalledWith(PaymentsTable);
      expect(result).toBe("Payment added successfully");
    });
  });

  describe("getPaymentService", () => {
    it("should return all payments", async () => {
      const payments: TSPayment[] = [
        {
          paymentID: 1,
          customerID: 101,
          bookingID: 201,
          amount: "5000.00",
          paymentStatus: "Pending",
          paymentDate: "2024-07-01T08:30:00.000Z",
          paymentMethod: "M-Pesa",
          transactionID: "MPESA123456789",
          createdAt: "2024-07-01T08:31:00.000Z",
          updatedAt: "2024-07-01T08:31:00.000Z",
        },
        {
          paymentID: 1,
          customerID: 101,
          bookingID: 201,
          amount: "5000.00",
          paymentStatus: "Pending",
          paymentDate: "2024-07-01T08:30:00.000Z",
          paymentMethod: "M-Pesa",
          transactionID: "MPESA123456789",
          createdAt: "2024-07-01T08:31:00.000Z",
          updatedAt: "2024-07-01T08:31:00.000Z",
        },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValueOnce(payments),
      });

      const result = await getPaymentService();
      expect(result).toEqual(payments);
    });
  });

  describe("getPaymentByIdService", () => {
    it("should return payment by ID", async () => {
      const payment: TSPayment = {
        paymentID: 1,
        customerID: 101,
        bookingID: 201,
        amount: "5000.00",
        paymentStatus: "Pending",
        paymentDate: "2024-07-01T08:30:00.000Z",
        paymentMethod: "M-Pesa",
        transactionID: "MPESA123456789",
        createdAt: "2024-07-01T08:31:00.000Z",
        updatedAt: "2024-07-01T08:31:00.000Z",
      };

      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(
        payment
      );

      const result = await getPaymentByIdService(1);
      expect(result).toEqual(payment);
    });
  });

  describe("updatePaymentService", () => {
    it("should update payment and return success message", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}]),
          }),
        }),
      });

      const result = await updatePaymentService(1, {
        customerID: 1,
        bookingID: 201,
        amount: "1800.00",
        paymentMethod: "Credit Card",
        paymentStatus: "Completed",
        transactionID: "TXN123456789",
      });
      expect(result).toBe("Payment updated successfully");
    });
  });

  describe("deletePaymentService", () => {
    it("should delete payment and return the deleted payment", async () => {
      const deletedPayment: TSPayment = {
        paymentID: 1,
        customerID: 101,
        bookingID: 201,
        amount: "5000.00",
        paymentStatus: "Pending",
        paymentDate: "2024-07-01T08:30:00.000Z",
        paymentMethod: "M-Pesa",
        transactionID: "MPESA123456789",
        createdAt: "2024-07-01T08:31:00.000Z",
        updatedAt: "2024-07-01T08:31:00.000Z",
      };

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([deletedPayment]),
        }),
      });

      const result = await deletePaymentService(1);
      expect(result).toEqual(deletedPayment);
    });
  });

  describe("getPaymentsByCustomerService", () => {
    it("should return payments for a specific customer", async () => {
      const customerPayments: TSPayment[] = [
        {
          paymentID: 1,
          customerID: 101,
          bookingID: 201,
          amount: "5000.00",
          paymentStatus: "Pending",
          paymentDate: "2024-07-01T08:30:00.000Z",
          paymentMethod: "M-Pesa",
          transactionID: "MPESA123456789",
          createdAt: "2024-07-01T08:31:00.000Z",
          updatedAt: "2024-07-01T08:31:00.000Z",
        },
        {
          paymentID: 1,
          customerID: 101,
          bookingID: 201,
          amount: "5000.00",
          paymentStatus: "Pending",
          paymentDate: "2024-07-01T08:30:00.000Z",
          paymentMethod: "M-Pesa",
          transactionID: "MPESA123456789",
          createdAt: "2024-07-01T08:31:00.000Z",
          updatedAt: "2024-07-01T08:31:00.000Z",
        },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValueOnce(customerPayments),
        }),
      });

      const result = await getPaymentsByCustomerService(1);
      expect(result).toEqual(customerPayments);
    });
  });
});
