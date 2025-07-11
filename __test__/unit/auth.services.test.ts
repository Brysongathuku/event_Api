import {
  createCustomerService,
  verifyCustomerService,
  customerLoginService,
  getCustomerService,
  getCustomerByIdService,
  getCustomerByEmailService,
  updateCustomerService,
  deleteCustomerService,
} from "../../src/auth/auth.service";
import db from "../../src/Drizzle/db";
import {
  CustomersTable,
  TICustomer,
  TSCustomer,
  TSCustomerLoginInput,
} from "../../src/Drizzle/schema";

// Mock the database
jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    CustomersTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Customer Service", () => {
  describe("createCustomerService", () => {
    it("should insert a customer and return success message", async () => {
      const customer: TICustomer = {
        firstName: "Erica",
        lastName: "Nyaikamba",
        email: "erikapanda@gmail.com",
        password: "pass123",
        contactPhone: "0700267677",
        address: "Nairobi CBD",
        role: "user",
      };

      const mockInsert = {
        values: jest.fn().mockResolvedValueOnce([{ customerID: 1 }]),
      };
      (mockDb.insert as jest.Mock).mockReturnValue(mockInsert);

      const result = await createCustomerService(customer);

      expect(mockDb.insert).toHaveBeenCalledWith(CustomersTable);
      expect(result).toBe("Customer added successfully");
    });
  });

  describe("verifyCustomerService", () => {
    it("should update customer verification status", async () => {
      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValueOnce([{ customerID: 1 }]),
        }),
      };
      (mockDb.update as jest.Mock).mockReturnValue(mockUpdate);

      await verifyCustomerService("erikapanda@gmail.com");

      expect(mockDb.update).toHaveBeenCalledWith(CustomersTable);
    });
  });

  describe("customerLoginService", () => {
    it("should return a logged-in customer", async () => {
      const foundCustomer: TSCustomer = {
        customerID: 3,
        firstName: "Kansy",
        lastName: "Sue",
        email: "kansy841@gmail.com",
        password: "mocked_hashed_password_from_db_abc123",
        contactPhone: "0790519306",
        address: "Nairobi CBD",
        role: "user",
        isVerified: true,
        verificationCode: null,
        createdAt: "22:10",
        updatedAt: "12:00",
      };

      (
        mockDb.query.CustomersTable.findFirst as jest.Mock
      ).mockResolvedValueOnce(foundCustomer);

      const loginInput: TSCustomerLoginInput = {
        email: "kansy841@gmail.com",
        password: "pass123",
      };

      const result = await customerLoginService(foundCustomer);
      expect(result).toEqual(foundCustomer);
    });
  });

  describe("getCustomerService", () => {
    it("should return all customers", async () => {
      const customers: TSCustomer[] = [
        {
          customerID: 1,
          firstName: "Kansy",
          lastName: "Sue",
          email: "kansy841@gmail.com",
          contactPhone: "0700267677",
          address: "Nyeri Boma",
          password: "hashed_password_1",
          role: "admin",
          isVerified: true,
          verificationCode: null,
          createdAt: "11:00",
          updatedAt: "13:56",
        },
        {
          customerID: 2,
          firstName: "Erica",
          lastName: "Nyaikamba",
          email: "erikapanda@gmail.com",
          contactPhone: "0700267677",
          address: "Nairobi CBD",
          password: "hashed_password_2",
          role: "user",
          isVerified: false,
          verificationCode: "AB0975",
          createdAt: "11:00",
          updatedAt: "13:56",
        },
      ];

      (mockDb.query.CustomersTable.findMany as jest.Mock).mockResolvedValueOnce(
        customers
      );

      const result = await getCustomerService();
      expect(result).toEqual(customers);
    });
  });

  describe("getCustomerByIdService", () => {
    it("should return customer by ID", async () => {
      const customer: TSCustomer = {
        customerID: 1,
        firstName: "Kansy",
        lastName: "Sue",
        email: "kansy841@gmail.com",
        contactPhone: "0700267677",
        address: "Nyeri Boma",
        password: "hashed_password_1",
        role: "admin",
        isVerified: true,
        verificationCode: null,
        createdAt: "11:00",
        updatedAt: "13:56",
      };

      (
        mockDb.query.CustomersTable.findFirst as jest.Mock
      ).mockResolvedValueOnce(customer);

      const result = await getCustomerByIdService(1);
      expect(result).toEqual(customer);
    });
  });

  describe("getCustomerByEmailService", () => {
    it("should return customer by email", async () => {
      const customer: TSCustomer = {
        customerID: 1,
        firstName: "Kansy",
        lastName: "Sue",
        email: "kansy841@gmail.com",
        contactPhone: "0700267677",
        address: "Nyeri Boma",
        password: "hashed_password_1",
        role: "admin",
        isVerified: true,
        verificationCode: null,
        createdAt: "11:00",
        updatedAt: "13:56",
      };

      (
        mockDb.query.CustomersTable.findFirst as jest.Mock
      ).mockResolvedValueOnce(customer);

      const result = await getCustomerByEmailService("hello@example.com");
      expect(result).toEqual(customer);
    });
  });

  describe("updateCustomerService", () => {
    it("should update customer and return success message", async () => {
      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{ customerID: 1 }]),
          }),
        }),
      };
      (mockDb.update as jest.Mock).mockReturnValue(mockUpdate);

      const result = await updateCustomerService(1, {
        firstName: "Susan",
        lastName: "Kanana",
        email: "suzzannekans@gmail.com",
        password: "pass123",
        role: "admin",
      });

      expect(result).toBe("Customer updated successfully");
    });
  });

  describe("deleteCustomerService", () => {
    it("should delete customer and return success message", async () => {
      const mockDelete = {
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{ customerID: 1 }]),
        }),
      };
      (mockDb.delete as jest.Mock).mockReturnValue(mockDelete);

      const result = await deleteCustomerService(1);
      expect(result).toBe("Customer deleted successfully");
    });
  });
});
