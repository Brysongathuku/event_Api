import db from "../Drizzle/db";
import { EventsTable, TIEvent } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
//  create  an  event
export const CreateEventService = async (event: TIEvent) => {
  const [inserted] = await db.insert(EventsTable).values(event).returning();
  if (inserted) {
    return inserted;
  }
  return null;
};
//  get all events
export const getEventService = async () => {
  const events = await db.select().from(EventsTable);
  return events;
};

//  get  events by id
export const getEventByIdService = async (id: number) => {
  const event = await db.query.EventsTable.findFirst({
    where: eq(EventsTable.eventID, id),
  });
  return event;
};
//  update events   id
export const updateEventService = async (id: number, event: TIEvent) => {
  await db
    .update(EventsTable)
    .set(event)
    .where(eq(EventsTable.eventID, id))
    .returning();
  return "event updated successfully";
};
//  delete event  by  id
export const deleteEventService = async (id: number, event: TIEvent) => {
  const deletedEvent = await db
    .delete(EventsTable)
    .where(eq(EventsTable.eventID, id))
    .returning();
  return deletedEvent[0];
};
