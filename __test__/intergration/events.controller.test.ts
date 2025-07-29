import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import { EventsTable, CustomersTable } from "../../src/Drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

let adminToken: string;
let adminID: number;
let eventID: number;

describe("📅 Event API", () => {
  afterAll(async () => {
    await db.delete(EventsTable).where(eq(EventsTable.eventID, eventID));
    // await db.$client.end();
  });
  beforeAll(async () => {
    //  Create Admin
    const hashedPassword = bcrypt.hashSync("AdminPass123", 10);
    const [admin] = await db
      .insert(CustomersTable)
      .values({
        firstName: "Admin",
        lastName: "User",
        email: "admin@event.com",
        password: hashedPassword,
        contactPhone: "0700000000",
        address: "Admin Street",
        role: "admin",
        isVerified: true,
      })
      .returning();
    adminID = admin.customerID;

    // Login Admin
    const res = await request(app).post("/auth/login").send({
      email: "admin@event.com",
      password: "AdminPass123",
    });
    adminToken = res.body.token;
  });

  it("should create an event", async () => {
    const res = await request(app)
      .post("/event/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "AI Conference",
        description: "Latest in AI and tech",
        eventDate: new Date().toISOString(),
        startTime: new Date().toISOString(),
        ticketPrice: "1000.00",
        availableTickets: 200,
        totalTickets: 200,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("event created successfully");

    const event = await db.select().from(EventsTable).limit(1);
    eventID = event[0].eventID;
  });

  it("should fetch all events", async () => {
    const res = await request(app).get("/events");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should fetch an event by ID", async () => {
    const res = await request(app).get(`/event/${eventID}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("eventID", eventID);
  });

  it("should update an event", async () => {
    const res = await request(app)
      .put(`/event/${eventID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        availableTickets: 180,
        ticketPrice: "1200.00",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("event updated successfully");
  });

  it("should delete an event", async () => {
    const res = await request(app)
      .delete(`/event/${eventID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  //  Negative tests
  it("should not create event without token", async () => {
    const res = await request(app).post("/event/register").send({
      title: "No Auth Event",
      eventDate: new Date().toISOString(),
      startTime: new Date().toISOString(),
      ticketPrice: "500.00",
      availableTickets: 50,
      totalTickets: 50,
    });
    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for non-existent event", async () => {
    const res = await request(app).get(`/event/999999`);
    expect(res.statusCode).toBe(404);
  });
});
