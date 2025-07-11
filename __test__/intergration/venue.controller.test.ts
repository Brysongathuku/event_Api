import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import bcrypt from "bcryptjs";
import {
  CustomersTable,
  VenuesTable,
  EventsTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let adminToken: string;
let customerToken: string;
let adminId: number;
let customerId: number;
let testVenueId: number;
let testEventId: number;

const adminUser = {
  firstName: "Admin",
  lastName: "Tester",
  email: "admin@venue.com",
  password: "AdminPass123",
  phoneNumber: "0711223344",
  address: "Admin St",
  role: "admin" as const,
  isVerified: true,
};

const customerUser = {
  firstName: "Customer",
  lastName: "Tester",
  email: "customer@venue.com",
  password: "CustPass123",
  phoneNumber: "0700112233",
  address: "Customer Ave",
  role: "user" as const,
  isVerified: true,
};

beforeAll(async () => {
  await db.delete(EventsTable);
  await db.delete(VenuesTable);
  await db.delete(CustomersTable);

  const hashedAdminPassword = bcrypt.hashSync(adminUser.password, 10);
  const [admin] = await db
    .insert(CustomersTable)
    .values({ ...adminUser, password: hashedAdminPassword })
    .returning();
  adminId = admin.customerID;

  const hashedCustomerPassword = bcrypt.hashSync(customerUser.password, 10);
  const [customer] = await db
    .insert(CustomersTable)
    .values({ ...customerUser, password: hashedCustomerPassword })
    .returning();
  customerId = customer.customerID;

  const adminLogin = await request(app)
    .post("/auth/login")
    .send({ email: adminUser.email, password: adminUser.password });
  adminToken = adminLogin.body.token;

  const customerLogin = await request(app)
    .post("/auth/login")
    .send({ email: customerUser.email, password: customerUser.password });
  customerToken = customerLogin.body.token;

  const [venue] = await db
    .insert(VenuesTable)
    .values({
      name: "Test Venue",
      address: "Test Address",
      capacity: 100,
      contactNumber: "0700123456",
    })
    .returning();
  testVenueId = venue.venueID;

  // Insert a test event associated with the venue
  const [event] = await db
    .insert(EventsTable)
    .values({
      title: "Test Event",
      venueID: testVenueId,
      eventDate: "2025-08-01",
      startTime: "18:00:00",
      ticketPrice: "50.00", // Changed to string to match schema
      availableTickets: 100,
      totalTickets: 100,
      description: "A test event",
      isActive: true,
    })
    .returning();
  testEventId = event.eventID;
});

afterAll(async () => {
  await db.delete(EventsTable).where(eq(EventsTable.eventID, testEventId));
  await db.delete(VenuesTable).where(eq(VenuesTable.venueID, testVenueId));
  await db.delete(CustomersTable).where(eq(CustomersTable.customerID, adminId));
  await db
    .delete(CustomersTable)
    .where(eq(CustomersTable.customerID, customerId));
});

describe("Venue Controller Integration Tests", () => {
  it("Should register venue (admin only)", async () => {
    const res = await request(app)
      .post("/venue/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "New Venue",
        address: "New Address",
        capacity: 200,
        contactNumber: "0700987654",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBeDefined();

    const venue = await db.query.VenuesTable.findFirst({
      where: eq(VenuesTable.name, "New Venue"),
    });

    expect(venue).toBeTruthy();
    testVenueId = venue!.venueID;
  });

  it("Should fail to register venue without token", async () => {
    const res = await request(app).post("/venue/register").send({
      name: "Unauthorized Venue",
      address: "Unauthorized Address",
      capacity: 150,
      contactNumber: "0700112233",
    });

    expect(res.statusCode).toBe(401);
  });

  it("Should fetch all venues", async () => {
    const res = await request(app)
      .get("/venues")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("Should get venue by ID", async () => {
    const res = await request(app)
      .get(`/venue/${testVenueId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("venueID", testVenueId);
  });

  it("Should get venue with events", async () => {
    const res = await request(app)
      .get(`/venue/${testVenueId}/events`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("venueID", testVenueId);
    expect(res.body.events).toBeInstanceOf(Array);
    expect(res.body.events.length).toBeGreaterThan(0);
    expect(res.body.events[0]).toHaveProperty("eventID", testEventId);
  });

  it("Should update venue", async () => {
    const res = await request(app)
      .put(`/venue/${testVenueId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Venue", address: "Updated Address" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("venue updated successfully");
  });

  it("Should delete venue", async () => {
    const res = await request(app)
      .delete(`/venue/${testVenueId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it("Should block customer from accessing venue routes", async () => {
    const res = await request(app)
      .get("/venues")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(401);
  });
});
