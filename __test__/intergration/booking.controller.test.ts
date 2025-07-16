import request from "supertest";
import app from "../../src"; //
import db from "../../src/Drizzle/db";
import bcrypt from "bcryptjs";

import {
  CustomersTable,
  EventsTable,
  BookingsTable,
} from "../../src/Drizzle/schema";

let customerToken: string;
let customerID: number;
let adminToken: string;
let adminID: number;
let eventID: number;
let bookingID: number;

describe(" Booking API", () => {
  beforeAll(async () => {
    // Cleanup tables
    await db.delete(BookingsTable);
    await db.delete(EventsTable);
    await db.delete(CustomersTable);

    // Create a user
    const [user] = await db
      .insert(CustomersTable)
      .values({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: bcrypt.hashSync("UserPass123", 10),
        contactPhone: "0712345678",
        address: "Customer Street",
        role: "user",
        isVerified: true,
      })
      .returning();
    customerID = user.customerID;

    // Create an admin
    const [admin] = await db
      .insert(CustomersTable)
      .values({
        firstName: "Admin",
        lastName: "Tester",
        email: "admin@example.com",
        password: bcrypt.hashSync("AdminPass123", 10),
        contactPhone: "0799999999",
        address: "Admin Lane",
        role: "admin",
        isVerified: true,
      })
      .returning();
    adminID = admin.customerID;

    // Login user
    const customerRes = await request(app).post("/auth/login").send({
      email: "jane@example.com",
      password: "UserPass123",
    });
    customerToken = customerRes.body.token;

    // Login admin
    const adminRes = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "AdminPass123",
    });
    adminToken = adminRes.body.token;

    // Create an event
    const [event] = await db
      .insert(EventsTable)
      .values({
        title: "Nairobi Tech Summit",
        description: "A major developer event",
        eventDate: new Date().toISOString(),
        startTime: new Date().toISOString(),
        ticketPrice: "1500.00",
        availableTickets: 100,
        totalTickets: 100,
        isActive: true,
      })
      .returning();
    eventID = event.eventID;
  });

  it("should create a booking", async () => {
    const res = await request(app)
      .post("/booking/register")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        customerID,
        eventID,
        totalAmount: "3000.00",
        numberOfTickets: 2,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Booking added successfully");

    const [booking] = await db.select().from(BookingsTable);
    bookingID = booking.bookingID;
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
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should update a booking", async () => {
    const res = await request(app)
      .put(`/booking/${bookingID}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        numberOfTickets: 3,
        totalAmount: "4500.00",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Booking updated successfully");
  });

  it("should delete a booking", async () => {
    const res = await request(app)
      .delete(`/booking/${bookingID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  //  Negative Tests

  it(" should not create booking with missing eventID", async () => {
    const res = await request(app)
      .post("/booking/register")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        customerID,
        totalAmount: "3000.00",
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it(" should not fetch booking with invalid ID", async () => {
    const res = await request(app)
      .get("/booking/invalid")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it(" should return 404 for non-existent booking", async () => {
    const res = await request(app)
      .get("/booking/99999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Booking not found");
  });

  it(" should reject booking without auth", async () => {
    const res = await request(app).post("/booking/register").send({
      customerID,
      eventID,
      totalAmount: "1000.00",
      numberOfTickets: 1,
    });

    expect(res.statusCode).toBe(401);
  });

  it(" should not allow user to delete a booking", async () => {
    const [booking] = await db
      .insert(BookingsTable)
      .values({
        customerID,
        eventID,
        totalAmount: "2000.00",
        numberOfTickets: 2,
      })
      .returning();

    const res = await request(app)
      .delete(`/booking/${booking.bookingID}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(401);
  });

  it(" should return 404 for deleting non-existent booking", async () => {
    const res = await request(app)
      .delete("/booking/999999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Booking not found");
  });
});
