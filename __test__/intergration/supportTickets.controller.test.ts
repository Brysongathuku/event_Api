// __test__/integration/support_tickets.test.ts
import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import bcrypt from "bcryptjs";
import {
  CustomersTable,
  CustomerSupportTicketsTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let adminToken: string;
let userToken: string;
let customerID: number;
let ticketID: number;

describe(" Support Tickets API", () => {
  afterAll(async () => {
    await db
      .delete(CustomersTable)
      .where(eq(CustomersTable.customerID, customerID));
    await db
      .delete(CustomerSupportTicketsTable)
      .where(eq(CustomerSupportTicketsTable.customerID, customerID));
    await db.$client.end();
  });
  beforeAll(async () => {
    const hashedPassword = bcrypt.hashSync("UserPass123", 10);
    const [user] = await db
      .insert(CustomersTable)
      .values({
        firstName: "User",
        lastName: "Doe",
        email: "user@example.com",
        password: hashedPassword,
        contactPhone: "0712345678",
        address: "User Lane",
        role: "user",
        isVerified: true,
      })
      .returning();
    customerID = user.customerID;

    const hashedAdminPassword = bcrypt.hashSync("AdminPass123", 10);
    const [admin] = await db
      .insert(CustomersTable)
      .values({
        firstName: "Admin",
        lastName: "Test",
        email: "admin@example.com",
        password: hashedAdminPassword,
        contactPhone: "0700000000",
        address: "Admin Rd",
        role: "admin",
        isVerified: true,
      })
      .returning();

    const userRes = await request(app).post("/auth/login").send({
      email: "user@example.com",
      password: "UserPass123",
    });
    userToken = userRes.body.token;

    const adminRes = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "AdminPass123",
    });
    adminToken = adminRes.body.token;
  });

  it(" should create a support ticket", async () => {
    const res = await request(app)
      .post("/ticket/register")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        customerID,
        subject: "Payment not reflected",
        description: "Paid via M-PESA but no ticket issued",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.ticket).toHaveProperty("ticketID");
    ticketID = res.body.ticket.ticketID;
  });

  it(" should fetch all tickets (admin)", async () => {
    const res = await request(app)
      .get("/tickets")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it(" should fetch ticket by ID", async () => {
    const res = await request(app)
      .get(`/ticket/${ticketID}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("ticketID", ticketID);
  });

  it(" should update ticket status", async () => {
    const res = await request(app)
      .put(`/ticket/${ticketID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Resolved" });

    expect(res.statusCode).toBe(200);
    expect(res.body.ticket.status).toBe("Resolved");
  });

  it("should delete ticket", async () => {
    const res = await request(app)
      .delete(`/ticket/${ticketID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Support ticket deleted successfully");
  });

  //  Negative tests
  it(" should not create a ticket with missing fields", async () => {
    const res = await request(app)
      .post("/ticket/register")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ customerID });

    expect(res.statusCode).toBe(400);
  });

  it(" should return 404 for non-existent ticket ID", async () => {
    const res = await request(app)
      .get("/ticket/99999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it(" should not update ticket with invalid status", async () => {
    const res = await request(app)
      .put(`/ticket/${ticketID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Finished" }); // invalid status

    expect(res.statusCode).toBe(400);
  });

  it(" should not delete ticket with invalid ID", async () => {
    const res = await request(app)
      .delete(`/ticket/invalidID`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
  });
});
