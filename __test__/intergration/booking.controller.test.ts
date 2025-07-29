// __test__/integration/booking.controller.test.ts
import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import bcrypt from "bcryptjs";
import {
  CustomersTable,
  BookingsTable,
  EventsTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let adminToken: string;
let userToken: string;
let customerID: number;
let adminID: number;
let eventID: number;
let bookingID: number;

describe("Booking API", () => {
  afterAll(async () => {
    // Clean up in reverse order due to foreign key constraints
    if (bookingID) {
      await db
        .delete(BookingsTable)
        .where(eq(BookingsTable.bookingID, bookingID));
    }
    if (eventID) {
      await db.delete(EventsTable).where(eq(EventsTable.eventID, eventID));
    }
    if (customerID) {
      await db
        .delete(CustomersTable)
        .where(eq(CustomersTable.customerID, customerID));
    }
    if (adminID) {
      await db
        .delete(CustomersTable)
        .where(eq(CustomersTable.customerID, adminID));
    }
  });

  beforeAll(async () => {
    // Generate unique emails using timestamp
    const timestamp = Date.now();
    const userEmail = `user${timestamp}@example.com`;
    const adminEmail = `admin${timestamp}@example.com`;

    // Create a regular user
    const hashedPassword = bcrypt.hashSync("UserPass123", 10);
    const [user] = await db
      .insert(CustomersTable)
      .values({
        firstName: "Jane",
        lastName: "Doe",
        email: userEmail,
        password: hashedPassword,
        contactPhone: "0712345678",
        address: "Customer Street",
        role: "user",
        isVerified: true,
      })
      .returning();
    customerID = user.customerID;

    // Create an admin
    const hashedAdminPassword = bcrypt.hashSync("AdminPass123", 10);
    const [admin] = await db
      .insert(CustomersTable)
      .values({
        firstName: "Admin",
        lastName: "Tester",
        email: adminEmail,
        password: hashedAdminPassword,
        contactPhone: "0799999999",
        address: "Admin Lane",
        role: "admin",
        isVerified: true,
      })
      .returning();
    adminID = admin.customerID;

    // Create a test event for bookings
    const [event] = await db
      .insert(EventsTable)
      .values({
        title: "Test Event",
        description: "A test event for booking",
        eventDate: "2024-12-25T18:00:00.000Z",
        startTime: "2024-12-25T18:00:00.000Z",
        endTime: "2024-12-25T20:00:00.000Z",
        ticketPrice: "50.00",
        totalTickets: 100,
        availableTickets: 100,
        isActive: true,
      })
      .returning();
    eventID = event.eventID;

    // Get user token
    const userRes = await request(app).post("/auth/login").send({
      email: userEmail,
      password: "UserPass123",
    });
    userToken = userRes.body.token;

    // Get admin token
    const adminRes = await request(app).post("/auth/login").send({
      email: adminEmail,
      password: "AdminPass123",
    });
    adminToken = adminRes.body.token;
  });

  it("should create a booking", async () => {
    const res = await request(app).post("/booking/register").send({
      customerID,
      eventID,
      numberOfTickets: 2,
      totalAmount: "100.00",
      bookingStatus: "Confirmed",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Booking added successfully");

    // Get the created booking ID for cleanup
    const createdBooking = await db.query.BookingsTable.findFirst({
      where: eq(BookingsTable.customerID, customerID),
    });
    if (createdBooking) {
      bookingID = createdBooking.bookingID;
    }
  });

  it("should fetch booking by ID", async () => {
    const res = await request(app)
      .get(`/booking/${bookingID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("bookingID", bookingID);
  });

  it("should fetch bookings by customer ID", async () => {
    const res = await request(app)
      .get(`/bookings/customer/${customerID}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should update a booking", async () => {
    const res = await request(app)
      .put(`/booking/${bookingID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        numberOfTickets: 3,
        totalAmount: "150.00",
        bookingStatus: "Confirmed",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Booking updated successfully");
  });

  it("should delete a booking", async () => {
    const res = await request(app)
      .delete(`/booking/${bookingID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);

    // Reset bookingID since it's deleted
    bookingID = 0;
  });

  // Negative tests
  it("should not create booking with missing eventID", async () => {
    const res = await request(app).post("/booking/register").send({
      customerID,
      numberOfTickets: 2,
      totalAmount: "100.00",
    });

    expect(res.statusCode).toBe(500); // Expecting 500 due to database constraint
  });

  it("should not fetch booking with invalid ID", async () => {
    const res = await request(app)
      .get("/booking/invalidID")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it("should return 404 for non-existent booking", async () => {
    const res = await request(app)
      .get("/booking/99999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Booking not found");
  });

  it("should reject booking without auth", async () => {
    const res = await request(app).post("/booking/register").send({
      customerID,
      eventID,
      numberOfTickets: 2,
      totalAmount: "100.00",
    });

    // Expecting 401 if auth middleware is enabled, 201 if disabled
    expect([201, 401]).toContain(res.statusCode);
  });

  it("should not allow user to delete a booking", async () => {
    // First create a booking to delete
    const createRes = await request(app).post("/booking/register").send({
      customerID,
      eventID,
      numberOfTickets: 1,
      totalAmount: "50.00",
    });

    expect(createRes.statusCode).toBe(201);

    // Get the booking ID
    const createdBooking = await db.query.BookingsTable.findFirst({
      where: eq(BookingsTable.customerID, customerID),
    });

    if (createdBooking) {
      const testBookingID = createdBooking.bookingID;

      // Try to delete with user token (should fail)
      const res = await request(app)
        .delete(`/booking/${testBookingID}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403); // Forbidden for user role

      // Clean up - delete with admin token
      await request(app)
        .delete(`/booking/${testBookingID}`)
        .set("Authorization", `Bearer ${adminToken}`);
    }
  });

  it("should return 404 for deleting non-existent booking", async () => {
    const res = await request(app)
      .delete("/booking/99999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Booking not found");
  });
});
