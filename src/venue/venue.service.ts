import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIVenue, VenuesTable } from "../Drizzle/schema";

// Create venue
export const createVenueService = async (venue: TIVenue) => {
  await db.insert(VenuesTable).values(venue).returning();
  return "venue added successfully";
};

// Get all venues
export const getVenueService = async () => {
  const venue = await db.select().from(VenuesTable);
  return venue;
};

// Get venue by ID
export const getVenueByIdService = async (id: number) => {
  const venue = await db.query.VenuesTable.findFirst({
    where: eq(VenuesTable.venueID, id),
  });
  return venue;
};

// Update venue
export const updateVenueService = async (id: number, venue: TIVenue) => {
  await db
    .update(VenuesTable)
    .set(venue)
    .where(eq(VenuesTable.venueID, id))
    .returning();
  return "venue updated successfully";
};

// Delete venue
export const deleteVenueService = async (id: number) => {
  const deletedvenue = await db
    .delete(VenuesTable)
    .where(eq(VenuesTable.venueID, id))
    .returning();
  return deletedvenue[0];
};

export const getVenueWithEventsService = async (venueID: number) => {
  try {
    const venue = await db.query.VenuesTable.findFirst({
      where: eq(VenuesTable.venueID, venueID),
      with: {
        events: {
          orderBy: (events, { asc }) => [asc(events.eventDate)],
        },
      },
    });

    return venue;
  } catch (error) {
    console.error("Error in getVenueWithEventsService:", error);
    throw error;
  }
};
