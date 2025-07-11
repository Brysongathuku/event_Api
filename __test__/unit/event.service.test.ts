import {
  CreateEventService,
  getEventService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
} from "../../src/Events/event.Service";
import db from "../../src/Drizzle/db";
import { EventsTable, TIEvent, TSEvent } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    EventsTable: {
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Events Service", () => {
  describe("CreateEventService", () => {
    it("should insert an event and return the inserted event", async () => {
      const event: TIEvent = {
        eventID: 1,
        title: "Nairobi Tech Summit 2024",
        description:
          "Annual gathering of top East African tech innovators and startups.",
        eventDate: "2024-11-15T09:00:00.000Z",
        startTime: "2024-11-15T09:00:00.000Z",
        endTime: "2024-11-15T17:00:00.000Z",
        ticketPrice: "3000.00",
        availableTickets: 450,
        totalTickets: 500,
        isActive: true,
        venueID: 1,
        createdAt: "2024-09-01T10:00:00.000Z",
        updatedAt: "2024-09-10T08:30:00.000Z",
      };

      const insertedEvent = {
        eventID: 1,
        ...event,
        createdAt: "2024-07-09T10:00:00Z",
        updatedAt: "2024-07-09T10:00:00Z",
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([insertedEvent]),
        }),
      });

      const result = await CreateEventService(event);
      expect(db.insert).toHaveBeenCalledWith(EventsTable);
      expect(result).toEqual(insertedEvent);
    });

    it("should return null if insertion fails", async () => {
      const event: TIEvent = {
        eventID: 1,
        title: "Nairobi Tech Summit 2024",
        description:
          "Annual gathering of top East African tech innovators and startups.",
        eventDate: "2024-11-15T09:00:00.000Z",
        startTime: "2024-11-15T09:00:00.000Z",
        endTime: "2024-11-15T17:00:00.000Z",
        ticketPrice: "3000.00",
        availableTickets: 450,
        totalTickets: 500,
        isActive: true,
        venueID: 1,
        createdAt: "2024-09-01T10:00:00.000Z",
        updatedAt: "2024-09-10T08:30:00.000Z",
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const result = await CreateEventService(event);
      expect(result).toBeNull();
    });
  });

  describe("getEventService", () => {
    it("should return all events", async () => {
      const events: TSEvent[] = [
        {
          eventID: 1,
          title: "Nairobi Tech Summit 2024",
          description:
            "Annual gathering of top East African tech innovators and startups.",
          eventDate: "2024-11-15T09:00:00.000Z",
          startTime: "2024-11-15T09:00:00.000Z",
          endTime: "2024-11-15T17:00:00.000Z",
          ticketPrice: "3000.00",
          availableTickets: 450,
          totalTickets: 500,
          isActive: true,
          venueID: 1,
          createdAt: "2024-09-01T10:00:00.000Z",
          updatedAt: "2024-09-10T08:30:00.000Z",
        },
        {
          eventID: 2,
          title: "Mombasa Music Festival",
          description:
            "Beachside music extravaganza with local and international DJs.",
          eventDate: "2024-12-05T16:00:00.000Z",
          startTime: "2024-12-05T16:00:00.000Z",
          endTime: "2024-12-05T23:59:00.000Z",
          ticketPrice: "2500.00",
          availableTickets: 1000,
          totalTickets: 1200,
          isActive: true,
          venueID: 2,
          createdAt: "2024-10-01T12:00:00.000Z",
          updatedAt: "2024-10-10T09:00:00.000Z",
        },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValueOnce(events),
      });

      const result = await getEventService();
      expect(db.select).toHaveBeenCalled();
      expect(result).toEqual(events);
    });

    it("should return empty array when no events exist", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await getEventService();
      expect(result).toEqual([]);
    });
  });

  describe("getEventByIdService", () => {
    it("should return event by ID", async () => {
      const event: TSEvent = {
        eventID: 1,
        title: "Nairobi Tech Summit 2024",
        description:
          "Annual gathering of top East African tech innovators and startups.",
        eventDate: "2024-11-15T09:00:00.000Z",
        startTime: "2024-11-15T09:00:00.000Z",
        endTime: "2024-11-15T17:00:00.000Z",
        ticketPrice: "3000.00",
        availableTickets: 450,
        totalTickets: 500,
        isActive: true,
        venueID: 1,
        createdAt: "2024-09-01T10:00:00.000Z",
        updatedAt: "2024-09-10T08:30:00.000Z",
      };

      (db.query.EventsTable.findFirst as jest.Mock).mockResolvedValueOnce(
        event
      );

      const result = await getEventByIdService(1);
      expect(db.query.EventsTable.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(result).toEqual(event);
    });

    it("should return undefined when event is not found", async () => {
      (db.query.EventsTable.findFirst as jest.Mock).mockResolvedValueOnce(
        undefined
      );

      const result = await getEventByIdService(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateEventService", () => {
    it("should update event and return success message", async () => {
      const updatedEvent: TIEvent = {
        eventID: 1,
        title: "Nairobi Tech Summit 2024",
        description:
          "Annual gathering of top East African tech innovators and startups.",
        eventDate: "2024-11-15T09:00:00.000Z",
        startTime: "2024-11-15T09:00:00.000Z",
        endTime: "2024-11-15T17:00:00.000Z",
        ticketPrice: "3000.00",
        availableTickets: 450,
        totalTickets: 500,
        isActive: true,
        venueID: 1,
        createdAt: "2024-09-01T10:00:00.000Z",
        updatedAt: "2024-09-10T08:30:00.000Z",
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}]),
          }),
        }),
      });

      const result = await updateEventService(1, updatedEvent);
      expect(db.update).toHaveBeenCalledWith(EventsTable);
      expect(result).toBe("event updated successfully");
    });
  });

  describe("deleteEventService", () => {
    it("should delete event and return the deleted event", async () => {
      const deletedEvent: TSEvent = {
        eventID: 1,
        title: "Nairobi Tech Summit 2024",
        description:
          "Annual gathering of top East African tech innovators and startups.",
        eventDate: "2024-11-15T09:00:00.000Z",
        startTime: "2024-11-15T09:00:00.000Z",
        endTime: "2024-11-15T17:00:00.000Z",
        ticketPrice: "3000.00",
        availableTickets: 450,
        totalTickets: 500,
        isActive: true,
        venueID: 1,
        createdAt: "2024-09-01T10:00:00.000Z",
        updatedAt: "2024-09-10T08:30:00.000Z",
      };

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([deletedEvent]),
        }),
      });

      // Note: The original function has an unused 'event' parameter
      const dummyEvent: TIEvent = {
        eventID: 1,
        title: "Nairobi Tech Summit 2024",
        description:
          "Annual gathering of top East African tech innovators and startups.",
        eventDate: "2024-11-15T09:00:00.000Z",
        startTime: "2024-11-15T09:00:00.000Z",
        endTime: "2024-11-15T17:00:00.000Z",
        ticketPrice: "3000.00",
        availableTickets: 450,
        totalTickets: 500,
        isActive: true,
        venueID: 1,
        createdAt: "2024-09-01T10:00:00.000Z",
        updatedAt: "2024-09-10T08:30:00.000Z",
      };

      const result = await deleteEventService(1, dummyEvent);
      expect(db.delete).toHaveBeenCalledWith(EventsTable);
      expect(result).toEqual(deletedEvent);
    });

    it("should handle case when no event is found to delete", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const dummyEvent: TIEvent = {
        eventID: 1,
        title: "Nairobi Tech Summit 2024",
        description:
          "Annual gathering of top East African tech innovators and startups.",
        eventDate: "2024-11-15T09:00:00.000Z",
        startTime: "2024-11-15T09:00:00.000Z",
        endTime: "2024-11-15T17:00:00.000Z",
        ticketPrice: "3000.00",
        availableTickets: 450,
        totalTickets: 500,
        isActive: true,
        venueID: 1,
        createdAt: "2024-09-01T10:00:00.000Z",
        updatedAt: "2024-09-10T08:30:00.000Z",
      };

      const result = await deleteEventService(999, dummyEvent);
      expect(result).toBeUndefined();
    });
  });
});
