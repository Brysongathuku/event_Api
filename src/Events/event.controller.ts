import e, { Request, Response } from "express";
import {
  CreateEventService,
  getEventService,
  updateEventService,
  deleteEventService,
  getEventByIdService,
} from "./event.Service";
import { controllers } from "chart.js";
//  createt  event  ccontroller
export const CreateEventController = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    const created = await CreateEventService(event);
    if (!created) return res.json({ message: "event not created" });
    return res.status(201).json({ message: created });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// get all events  controllers
export const getEventController = async (req: Request, res: Response) => {
  try {
    const events = await getEventService();
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }
    return res.status(200).json({ data: events });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// get  event by id
export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const event = await getEventByIdService(id);
    if (!event) return res.status(404).json({ message: "event not found" });
    return res.status(200).json({ data: event });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// update event by id controller
export const updateEventController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const event = req.body;
    const existingEvent = await getEventByIdService(id);
    if (!existingEvent)
      return res.status(404).json({ message: "event not found" });

    // You should implement and import updateEventService in your event.Service.ts
    const updated = await updateEventService(id, event);
    if (!updated) return res.status(400).json({ message: "event not updated" });
    return res.status(200).json({ message: "event updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// delete event by id controller
export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existingEvent = await getEventByIdService(id);
    if (!existingEvent)
      return res.status(404).json({ message: "event not found" });

    const deleted = await deleteEventService(id, existingEvent);
    if (!deleted) return res.status(400).json({ message: "event not deleted" });

    return res.status(204).json({ message: "event deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
