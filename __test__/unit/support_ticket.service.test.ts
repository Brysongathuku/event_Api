import {
  createSupportTicketService,
  getAllSupportTicketsService,
  getTicketsByCustomerService,
  getSupportTicketByIdService,
  updateSupportTicketStatusService,
  deleteSupportTicketService,
  getTicketsByStatusService,
} from "../../src/support_tickets/support_tickets.service";
import db from "../../src/Drizzle/db";
import {
  CustomerSupportTicketsTable,
  TISupportTicket,
  TSSupportTicket,
} from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    CustomerSupportTicketsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Mock console.error to prevent error logs during tests
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
  consoleSpy.mockClear();
});

afterAll(() => {
  consoleSpy.mockRestore();
});

describe("Customer Support Tickets Service", () => {
  describe("createSupportTicketService", () => {
    it("should create a support ticket and return the created ticket", async () => {
      const ticketData: TISupportTicket = {
        ticketID: 1,
        customerID: 101,
        subject: "Payment not reflecting",
        description: "I made a payment but it's not showing on my account.",
        status: "Open",
        createdAt: "2024-07-01T09:30:00.000Z",
        updatedAt: "2024-07-01T09:30:00.000Z",
      };

      const createdTicket: TSSupportTicket = {
        ticketID: 1,
        customerID: ticketData.customerID,
        subject: ticketData.subject,
        description: ticketData.description,
        status: ticketData.status ?? "Open",
        createdAt: "2024-07-09T10:00:00Z",
        updatedAt: "2024-07-09T10:00:00Z",
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([createdTicket]),
        }),
      });

      const result = await createSupportTicketService(ticketData);
      expect(db.insert).toHaveBeenCalledWith(CustomerSupportTicketsTable);
      expect(result).toEqual(createdTicket);
    });

    it("should handle errors during ticket creation", async () => {
      const ticketData: TISupportTicket = {
        ticketID: 1,
        customerID: 101,
        subject: "Payment not reflecting",
        description: "I made a payment but it's not showing on my account.",
        status: "Open",
        createdAt: "2024-07-01T09:30:00.000Z",
        updatedAt: "2024-07-01T09:30:00.000Z",
      };

      const error = new Error("Database error");
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValueOnce(error),
        }),
      });

      await expect(createSupportTicketService(ticketData)).rejects.toThrow(
        "Database error"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in createSupportTicketService:",
        error
      );
    });
  });

  describe("getAllSupportTicketsService", () => {
    it("should return all support tickets with customer details", async () => {
      const tickets = [
        {
          ticketID: 1,
          customerID: 1,
          subject: "Payment Issue",
          description: "Payment not going through",
          priority: "High",
          status: "Open",
          category: "Payment",
          createdAt: "2024-07-09T10:00:00Z",
          updatedAt: "2024-07-09T10:00:00Z",
          customer: {
            customerID: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            contactPhone: "0700123456",
          },
        },
        {
          ticketID: 2,
          customerID: 2,
          subject: "Technical Issue",
          description: "Website not loading properly",
          priority: "Medium",
          status: "In Progress",
          category: "Technical",
          createdAt: "2024-07-08T15:30:00Z",
          updatedAt: "2024-07-08T16:00:00Z",
          customer: {
            customerID: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            contactPhone: "0700654321",
          },
        },
      ];

      (
        db.query.CustomerSupportTicketsTable.findMany as jest.Mock
      ).mockResolvedValueOnce(tickets);

      const result = await getAllSupportTicketsService();
      expect(
        db.query.CustomerSupportTicketsTable.findMany
      ).toHaveBeenCalledWith({
        with: {
          customer: {
            columns: {
              customerID: true,
              firstName: true,
              lastName: true,
              email: true,
              contactPhone: true,
            },
          },
        },
        orderBy: expect.any(Array),
      });
      expect(result).toEqual(tickets);
    });

    it("should handle errors when fetching all tickets", async () => {
      const error = new Error("Database connection failed");
      (
        db.query.CustomerSupportTicketsTable.findMany as jest.Mock
      ).mockRejectedValueOnce(error);

      await expect(getAllSupportTicketsService()).rejects.toThrow(
        "Database connection failed"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in getAllSupportTicketsService:",
        error
      );
    });
  });

  describe("getTicketsByCustomerService", () => {
    it("should return tickets for a specific customer", async () => {
      const customerTickets = [
        {
          ticketID: 1,
          customerID: 1,
          subject: "Payment Issue",
          description: "Payment not going through",
          priority: "High",
          status: "Open",
          category: "Payment",
          createdAt: "2024-07-09T10:00:00Z",
          updatedAt: "2024-07-09T10:00:00Z",
        },
        {
          ticketID: 3,
          customerID: 1,
          subject: "Account Issue",
          description: "Cannot access my account",
          priority: "Medium",
          status: "Resolved",
          category: "Account",
          createdAt: "2024-07-07T12:00:00Z",
          updatedAt: "2024-07-07T14:00:00Z",
        },
      ];

      (
        db.query.CustomerSupportTicketsTable.findMany as jest.Mock
      ).mockResolvedValueOnce(customerTickets);

      const result = await getTicketsByCustomerService(1);
      expect(
        db.query.CustomerSupportTicketsTable.findMany
      ).toHaveBeenCalledWith({
        where: expect.any(Object),
        orderBy: expect.any(Array),
      });
      expect(result).toEqual(customerTickets);
    });

    it("should handle errors when fetching tickets by customer", async () => {
      const error = new Error("Customer not found");
      (
        db.query.CustomerSupportTicketsTable.findMany as jest.Mock
      ).mockRejectedValueOnce(error);

      await expect(getTicketsByCustomerService(999)).rejects.toThrow(
        "Customer not found"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in getTicketsByCustomerService:",
        error
      );
    });
  });

  describe("getSupportTicketByIdService", () => {
    it("should return a specific ticket with customer details", async () => {
      const ticket = {
        ticketID: 1,
        customerID: 1,
        subject: "Payment Issue",
        description: "Payment not going through",
        priority: "High",
        status: "Open",
        category: "Payment",
        createdAt: "2024-07-09T10:00:00Z",
        updatedAt: "2024-07-09T10:00:00Z",
        customer: {
          customerID: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          contactPhone: "0700123456",
        },
      };

      (
        db.query.CustomerSupportTicketsTable.findFirst as jest.Mock
      ).mockResolvedValueOnce(ticket);

      const result = await getSupportTicketByIdService(1);
      expect(
        db.query.CustomerSupportTicketsTable.findFirst
      ).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          customer: {
            columns: {
              customerID: true,
              firstName: true,
              lastName: true,
              email: true,
              contactPhone: true,
            },
          },
        },
      });
      expect(result).toEqual(ticket);
    });

    it("should return undefined when ticket is not found", async () => {
      (
        db.query.CustomerSupportTicketsTable.findFirst as jest.Mock
      ).mockResolvedValueOnce(undefined);

      const result = await getSupportTicketByIdService(999);
      expect(result).toBeUndefined();
    });

    it("should handle errors when fetching ticket by ID", async () => {
      const error = new Error("Database error");
      (
        db.query.CustomerSupportTicketsTable.findFirst as jest.Mock
      ).mockRejectedValueOnce(error);

      await expect(getSupportTicketByIdService(1)).rejects.toThrow(
        "Database error"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in getSupportTicketByIdService:",
        error
      );
    });
  });

  describe("updateSupportTicketStatusService", () => {
    it("should update ticket status and return updated ticket", async () => {
      const updatedTicket = {
        ticketID: 1,
        customerID: 1,
        subject: "Payment Issue",
        description: "Payment not going through",
        priority: "High",
        status: "Resolved",
        category: "Payment",
        createdAt: "2024-07-09T10:00:00Z",
        updatedAt: "2024-07-09T12:00:00Z",
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([updatedTicket]),
          }),
        }),
      });

      const result = await updateSupportTicketStatusService(1, "Resolved");
      expect(db.update).toHaveBeenCalledWith(CustomerSupportTicketsTable);
      expect(result).toEqual(updatedTicket);
    });

    it("should handle errors during status update", async () => {
      const error = new Error("Update failed");
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockRejectedValueOnce(error),
          }),
        }),
      });

      await expect(
        updateSupportTicketStatusService(1, "Closed")
      ).rejects.toThrow("Update failed");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in updateSupportTicketStatusService:",
        error
      );
    });
  });

  describe("deleteSupportTicketService", () => {
    it("should delete ticket and return deleted ticket", async () => {
      const deletedTicket = {
        ticketID: 1,
        customerID: 1,
        subject: "Payment Issue",
        description: "Payment not going through",
        priority: "High",
        status: "Open",
        category: "Payment",
        createdAt: "2024-07-09T10:00:00Z",
        updatedAt: "2024-07-09T10:00:00Z",
      };

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([deletedTicket]),
        }),
      });

      const result = await deleteSupportTicketService(1);
      expect(db.delete).toHaveBeenCalledWith(CustomerSupportTicketsTable);
      expect(result).toEqual(deletedTicket);
    });

    it("should handle errors during deletion", async () => {
      const error = new Error("Deletion failed");
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValueOnce(error),
        }),
      });

      await expect(deleteSupportTicketService(1)).rejects.toThrow(
        "Deletion failed"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in deleteSupportTicketService:",
        error
      );
    });
  });

  describe("getTicketsByStatusService", () => {
    it("should return tickets filtered by status", async () => {
      const openTickets = [
        {
          ticketID: 1,
          customerID: 1,
          subject: "Payment Issue",
          description: "Payment not going through",
          priority: "High",
          status: "Open",
          category: "Payment",
          createdAt: "2024-07-09T10:00:00Z",
          updatedAt: "2024-07-09T10:00:00Z",
          customer: {
            customerID: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            contactPhone: "0700123456",
          },
        },
        {
          ticketID: 4,
          customerID: 3,
          subject: "Login Issue",
          description: "Cannot log into my account",
          priority: "Medium",
          status: "Open",
          category: "Account",
          createdAt: "2024-07-08T09:00:00Z",
          updatedAt: "2024-07-08T09:00:00Z",
          customer: {
            customerID: 3,
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@example.com",
            contactPhone: "0700987654",
          },
        },
      ];

      (
        db.query.CustomerSupportTicketsTable.findMany as jest.Mock
      ).mockResolvedValueOnce(openTickets);

      const result = await getTicketsByStatusService("Open");
      expect(
        db.query.CustomerSupportTicketsTable.findMany
      ).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          customer: {
            columns: {
              customerID: true,
              firstName: true,
              lastName: true,
              email: true,
              contactPhone: true,
            },
          },
        },
        orderBy: expect.any(Array),
      });
      expect(result).toEqual(openTickets);
    });

    it("should return empty array when no tickets match status", async () => {
      (
        db.query.CustomerSupportTicketsTable.findMany as jest.Mock
      ).mockResolvedValueOnce([]);

      const result = await getTicketsByStatusService("Closed");
      expect(result).toEqual([]);
    });

    it("should handle errors when fetching tickets by status", async () => {
      const error = new Error("Status filter failed");
      (
        db.query.CustomerSupportTicketsTable.findMany as jest.Mock
      ).mockRejectedValueOnce(error);

      await expect(getTicketsByStatusService("Open")).rejects.toThrow(
        "Status filter failed"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in getTicketsByStatusService:",
        error
      );
    });
  });
});
