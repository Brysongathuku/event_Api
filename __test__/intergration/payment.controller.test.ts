import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import {
  CustomersTable,
  EventsTable,
  BookingsTable,
  PaymentsTable,
} from "../../src/Drizzle/schema";
import bcrypt from "bcryptjs";

let userToken: string;
let adminToken: string;
let customerID: number;
let bookingID: number;
let paymentID: number;

beforeAll(async () => {
  // Clean related tables
  await db.delete(PaymentsTable);
  await db.delete(BookingsTable);
  await db.delete(EventsTable);
  await db.delete(CustomersTable);

  // Seed user
  const hashedPassword = bcrypt.hashSync("UserPass123", 10);
  const [user] = await db
    .insert(CustomersTable)
    .values({
      firstName: "John",
      lastName: "Doe",
      email: "user@example.com",
      password: hashedPassword,
      contactPhone: "0700000000",
      address: "User Lane",
      role: "user",
      isVerified: true,
    })
    .returning();
  customerID = user.customerID;

  // Seed admin
  const hashedAdminPassword = bcrypt.hashSync("AdminPass123", 10);
  await db.insert(CustomersTable).values({
    firstName: "Admin",
    lastName: "Root",
    email: "admin@example.com",
    password: hashedAdminPassword,
    contactPhone: "0711111111",
    address: "Admin HQ",
    role: "admin",
    isVerified: true,
  });

  // Login user
  const userRes = await request(app).post("/auth/login").send({
    email: "user@example.com",
    password: "UserPass123",
  });
  userToken = userRes.body.token;

  // Login admin
  const adminRes = await request(app).post("/auth/login").send({
    email: "admin@example.com",
    password: "AdminPass123",
  });
  adminToken = adminRes.body.token;

  // Create event
  const [event] = await db
    .insert(EventsTable)
    .values({
      title: "Nairobi DevConf",
      description: "Developers Meetup",
      eventDate: new Date().toISOString(),
      startTime: new Date().toISOString(),
      ticketPrice: "1500.00",
      availableTickets: 100,
      totalTickets: 100,
      isActive: true,
    })
    .returning();

  // Create booking
  const [booking] = await db
    .insert(BookingsTable)
    .values({
      customerID,
      eventID: event.eventID,
      numberOfTickets: 2,
      totalAmount: "3000.00",
    })
    .returning();
  bookingID = booking.bookingID;
});

describe("💰 Payment API Integration", () => {
  it("✅ should create a payment", async () => {
    const res = await request(app)
      .post("/payment/register")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        customerID,
        bookingID,
        amount: "3000.00",
        paymentMethod: "M-Pesa",
        transactionID: "TXN1234567890",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toHaveProperty("paymentID");
    paymentID = res.body.message.paymentID;
  });

  it("✅ should fetch all payments", async () => {
    const res = await request(app)
      .get("/payments")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("✅ should fetch a payment by ID", async () => {
    const res = await request(app)
      .get(`/payment/${paymentID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.paymentID).toBe(paymentID);
  });

  it("✅ should update a payment", async () => {
    const res = await request(app)
      .put(`/payment/${paymentID}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ paymentStatus: "Completed" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Payment updated successfully");
  });

  it("✅ should get payments by customer ID", async () => {
    const res = await request(app)
      .get(`/payment/customer/${customerID}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.customerId).toBe(customerID);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("✅ should delete a payment", async () => {
    const res = await request(app)
      .delete(`/payment/${paymentID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  // 🔴 NEGATIVE TEST CASES

  it("❌ should return 404 for non-existent payment ID", async () => {
    const res = await request(app)
      .get("/payment/999999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("❌ should reject invalid customer ID in get by customer", async () => {
    const res = await request(app)
      .get("/payment/customer/invalid")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
  });

  it("❌ should reject invalid payment creation payload", async () => {
    const res = await request(app)
      .post("/payment/register")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        bookingID,
        amount: "500.00",
      }); // missing customerID and transactionID

    expect(res.statusCode).toBe(500); // You can improve this with schema validation
  });
});
