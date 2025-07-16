import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import bcrypt from "bcryptjs";
import { CustomersTable, VenuesTable } from "../../src/Drizzle/schema";

let adminToken: string;
let adminID: number;
let venueID: number;

const testVenue = {
  name: "Emirates",
  address: "North London,UK",
  capacity: "564",
  contactNumber: "0987654321",
};

describe("🏟️ Venue API Integration", () => {
  beforeAll(async () => {
    await db.delete(VenuesTable);
    await db.delete(CustomersTable);

    // Seed Admin
    const hashedPassword = bcrypt.hashSync("AdminPass123", 10);
    const [admin] = await db
      .insert(CustomersTable)
      .values({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: hashedPassword,
        contactPhone: "0700000000",
        address: "Admin Street",
        role: "admin",
        isVerified: true,
      })
      .returning();
    adminID = admin.customerID;

    const loginRes = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "AdminPass123",
    });
    adminToken = loginRes.body.token;
  });

  it(" should create a venue", async () => {
    const venueResponse = await db
      .insert(VenuesTable)
      .values({
        name: "Emirates",
        address: "North London,UK",
        capacity: 56,
        contactNumber: "0987654321999999",
      })
      .returning();
    venueID = venueResponse[0].venueID;

    // const res = await request(app)
    //   .post("/venue/register")
    //   .set("Authorization", `Bearer ${adminToken}`)
    //   .send({
    //     ...venueResponse,
    //   })

    //   .expect(201);
  });

  it("✅ should fetch all venues", async () => {
    const res = await request(app)
      .get("/venues")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("✅ should fetch venue by ID", async () => {
    const res = await request(app)
      .get(`/venue/${venueID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.venueID).toBe(venueID);
  });

  it("✅ should update venue", async () => {
    const res = await request(app)
      .put(`/venue/${venueID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Hall",
        address: "456 Innovation Blvd",
        capacity: 700,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("venue updated successfully");
  });

  it("✅ should delete venue", async () => {
    const res = await request(app)
      .delete(`/venue/${venueID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  // ❌ Negative tests
  it("❌ should fail to fetch non-existent venue", async () => {
    const res = await request(app)
      .get("/venue/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("venue not found");
  });

  it("❌ should fail to update non-existent venue", async () => {
    const res = await request(app)
      .put("/venue/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Fake Venue" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("venue not found");
  });

  it("❌ should fail to delete non-existent venue", async () => {
    const res = await request(app)
      .delete("/venue/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("venue not found");
  });

  it("❌ should reject venue creation with missing fields", async () => {
    const res = await request(app)
      .post("/venue/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Missing Capacity" });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
