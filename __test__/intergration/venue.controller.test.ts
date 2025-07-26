import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import { VenuesTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let adminToken: string;
let adminID: number;
let venueid: number;

const testVenue = {
  name: "Emirates",
  address: "North London,UK",
  capacity: "564",
  contactNumber: "0987654321",
};

describe("🏟️ Venue API Integration", () => {
  afterAll(async () => {
    await db.delete(VenuesTable).where(eq(VenuesTable.venueID, venueid));

    await db.$client.end();
  });
  beforeAll(async () => {
    // Seed Admin Venue (only allowed fields)
    const [admin] = await db
      .insert(VenuesTable)
      .values({
        name: "Admin Venue",
        address: "Admin Street",
        capacity: 100,
        contactNumber: "0700000000",
      })
      .returning();
    adminID = admin.venueID;

    // For tests that require adminToken, you may need to seed a user in the correct table and obtain a token there.
    adminToken = "dummy-admin-token"; // Replace with actual token logic if needed
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
    venueid = venueResponse[0].venueID;
    console.log("Venue response", venueResponse);
  });

  it("should fetch all venues", async () => {
    const res = await request(app)
      .get("/venues")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it(" should fetch venue by ID", async () => {
    const res = await request(app)
      .get(`/venue/${venueid}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.venueID).toBe(venueid);
  });

  it(" should update venue", async () => {
    const res = await request(app)
      .put(`/venue/${venueid}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Hall",
        address: "456 Innovation Blvd",
        capacity: 700,
      });

    expect(res.statusCode).toBe(200);
  });

  it(" should delete venue", async () => {
    const res = await request(app)
      .delete(`/venue/${venueid}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  // Negative tests
  it(" should fail to fetch non-existent venue", async () => {
    const res = await request(app)
      .get("/venue/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(401);
  });

  it(" should fail to update non-existent venue", async () => {
    const res = await request(app)
      .put("/venue/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Fake Venue" });

    expect(res.statusCode).toBe(401);
  });

  it("should fail to delete non-existent venue", async () => {
    const res = await request(app)
      .delete("/venue/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(401);
  });

  it(" should reject venue creation with missing fields", async () => {
    const res = await request(app)
      .post("/venue/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Missing Capacity" });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
