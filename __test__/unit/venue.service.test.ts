import {
  createVenueService,
  getVenueService,
  getVenueByIdService,
  updateVenueService,
  deleteVenueService,
  getVenueWithEventsService,
} from "../../src/venue/venue.service";
import db from "../../src/Drizzle/db";
import { VenuesTable, TIVenue, TSVenue } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    VenuesTable: {
      findFirst: jest.fn(),
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

describe("Venues Service", () => {
  describe("createVenueService", () => {
    it("should create a venue and return success message", async () => {
      const venue: TIVenue = {
        venueID: 1,
        name: "KICC - Nairobi",
        address: "Harambee Avenue, Nairobi, Kenya",
        capacity: 5000,
        contactNumber: "+254700123456",
        createdAt: "2024-06-15T09:00:00.000Z",
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{}]),
        }),
      });

      const result = await createVenueService(venue);
      expect(db.insert).toHaveBeenCalledWith(VenuesTable);
      expect(result).toBe("venue added successfully");
    });
  });

  describe("getVenueService", () => {
    it("should return all venues", async () => {
      const venues: TSVenue[] = [
        {
          venueID: 1,
          name: "KICC - Nairobi",
          address: "Harambee Avenue, Nairobi, Kenya",
          capacity: 5000,
          contactNumber: "+254700123456",
          createdAt: "2024-06-15T09:00:00.000Z",
        },
        {
          venueID: 1,
          name: "KICC - Nairobi",
          address: "Harambee Avenue, Nairobi, Kenya",
          capacity: 5000,
          contactNumber: "+254700123456",
          createdAt: "2024-06-15T09:00:00.000Z",
        },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValueOnce(venues),
      });

      const result = await getVenueService();
      expect(db.select).toHaveBeenCalled();
      expect(result).toEqual(venues);
    });

    it("should return empty array when no venues exist", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await getVenueService();
      expect(result).toEqual([]);
    });
  });

  describe("getVenueByIdService", () => {
    it("should return venue by ID", async () => {
      const venue: TSVenue = {
        venueID: 1,
        name: "KICC - Nairobi",
        address: "Harambee Avenue, Nairobi, Kenya",
        capacity: 5000,
        contactNumber: "+254700123456",
        createdAt: "2024-06-15T09:00:00.000Z",
      };

      (db.query.VenuesTable.findFirst as jest.Mock).mockResolvedValueOnce(
        venue
      );

      const result = await getVenueByIdService(1);
      expect(db.query.VenuesTable.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(result).toEqual(venue);
    });

    it("should return undefined when venue is not found", async () => {
      (db.query.VenuesTable.findFirst as jest.Mock).mockResolvedValueOnce(
        undefined
      );

      const result = await getVenueByIdService(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateVenueService", () => {
    it("should update venue and return success message", async () => {
      const updatedVenue: TIVenue = {
        venueID: 1,
        name: "KICC - Nairobi",
        address: "Harambee Avenue, Nairobi, Kenya",
        capacity: 5000,
        contactNumber: "+254700123456",
        createdAt: "2024-06-15T09:00:00.000Z",
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}]),
          }),
        }),
      });

      const result = await updateVenueService(1, updatedVenue);
      expect(db.update).toHaveBeenCalledWith(VenuesTable);
      expect(result).toBe("venue updated successfully");
    });
  });

  describe("deleteVenueService", () => {
    it("should delete venue and return the deleted venue", async () => {
      const deletedVenue: TSVenue = {
        venueID: 1,
        name: "KICC - Nairobi",
        address: "Harambee Avenue, Nairobi, Kenya",
        capacity: 5000,
        contactNumber: "+254700123456",
        createdAt: "2024-06-15T09:00:00.000Z",
      };

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([deletedVenue]),
        }),
      });

      const result = await deleteVenueService(1);
      expect(db.delete).toHaveBeenCalledWith(VenuesTable);
      expect(result).toEqual(deletedVenue);
    });

    it("should handle case when no venue is found to delete", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const result = await deleteVenueService(999);
      expect(result).toBeUndefined();
    });
  });

  describe("getVenueWithEventsService", () => {
    it("should return venue with associated events", async () => {
      const venueWithEvents = {
        venueID: 1,
        name: "KICC - Nairobi",
        address: "Harambee Avenue, Nairobi, Kenya",
        capacity: 5000,
        contactNumber: "+254700123456",
        createdAt: "2024-06-15T09:00:00.000Z",

        events: [
          {
            venueID: 1,
            name: "KICC - Nairobi",
            address: "Harambee Avenue, Nairobi, Kenya",
            capacity: 5000,
            contactNumber: "+254700123456",
            createdAt: "2024-06-15T09:00:00.000Z",
          },
          {
            venueID: 1,
            name: "KICC - Nairobi",
            address: "Harambee Avenue, Nairobi, Kenya",
            capacity: 5000,
            contactNumber: "+254700123456",
            createdAt: "2024-06-15T09:00:00.000Z",
          },
        ],
      };

      (db.query.VenuesTable.findFirst as jest.Mock).mockResolvedValueOnce(
        venueWithEvents
      );

      const result = await getVenueWithEventsService(1);
      expect(db.query.VenuesTable.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          events: {
            orderBy: expect.any(Function),
          },
        },
      });
      expect(result).toEqual(venueWithEvents);
    });

    it("should return venue with empty events array when no events exist", async () => {
      const venueWithNoEvents = {
        venueID: 1,
        name: "KICC - Nairobi",
        address: "Harambee Avenue, Nairobi, Kenya",
        capacity: 5000,
        contactNumber: "+254700123456",
        createdAt: "2024-06-15T09:00:00.000Z",
      };

      (db.query.VenuesTable.findFirst as jest.Mock).mockResolvedValueOnce(
        venueWithNoEvents
      );

      const result = await getVenueWithEventsService(1);
      expect(result).toEqual(venueWithNoEvents);
    });

    it("should return undefined when venue is not found", async () => {
      (db.query.VenuesTable.findFirst as jest.Mock).mockResolvedValueOnce(
        undefined
      );

      const result = await getVenueWithEventsService(999);
      expect(result).toBeUndefined();
    });

    it("should handle errors and throw them", async () => {
      const error = new Error("Database connection failed");
      (db.query.VenuesTable.findFirst as jest.Mock).mockRejectedValueOnce(
        error
      );

      await expect(getVenueWithEventsService(1)).rejects.toThrow(
        "Database connection failed"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in getVenueWithEventsService:",
        error
      );
    });
  });
});
