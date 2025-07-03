import { Request, Response } from "express";
import {
  createVenueService,
  getVenueByIdService,
  getVenueService,
  updateVenueService,
  deleteVenueService,
  getVenueWithEventsService,
} from "./venue.service";
// Create venue controller
export const registervenueController = async (req: Request, res: Response) => {
  try {
    const venue = req.body;

    const createdvenue = await createVenueService(venue);
    if (!createdvenue)
      return res.status(400).json({ message: "venue not created" });

    return res.status(201).json({ message: createdvenue });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all venues controller
export const getVenueController = async (_req: Request, res: Response) => {
  try {
    const venue = await getVenueService();
    if (!venue || venue.length === 0) {
      return res.status(404).json({ message: "No venue found" });
    }
    return res.status(200).json({ data: venue });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
// Get venue by ID controller
export const getVenueByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const venue = await getVenueByIdService(id);
    if (!venue) {
      return res.status(404).json({ message: "venue not found" });
    }
    return res.status(200).json({ data: venue });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getVenueWithEventsController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid venue ID" });
    }

    const venue = await getVenueWithEventsService(id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.status(200).json(venue);
  } catch (error) {
    console.error("Error fetching venue with events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update location by ID controller
export const updateVenueController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const venue = req.body;

    const existingvenue = await getVenueByIdService(id);
    if (!existingvenue) {
      return res.status(404).json({ message: "venue not found" });
    }

    const updatedvenue = await updateVenueService(id, venue);
    if (!updatedvenue) {
      return res.status(400).json({ message: "venue not updated" });
    }
    return res.status(200).json({ message: "venue updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete venue by ID controller
export const deleteVenueController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const existingvenue = await getVenueByIdService(id);
    if (!existingvenue) {
      return res.status(404).json({ message: "venue not found" });
    }

    const deleted = await deleteVenueService(id);
    if (!deleted) {
      return res.status(400).json({ message: "venue not deleted" });
    }

    return res.status(204).json({ message: "venue deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
