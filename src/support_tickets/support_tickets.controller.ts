import { Request, Response } from "express";
import {
  createSupportTicketService,
  getAllSupportTicketsService,
  getTicketsByCustomerService,
  getSupportTicketByIdService,
  updateSupportTicketStatusService,
  deleteSupportTicketService,
  getTicketsByStatusService,
} from "./support_tickets.service";

// Create a new support ticket
export const createSupportTicketController = async (
  req: Request,
  res: Response
) => {
  try {
    const { customerID, subject, description } = req.body;

    if (!customerID || !subject || !description) {
      return res.status(400).json({
        message: "Customer ID, subject, and description are required",
      });
    }

    const newTicket = await createSupportTicketService({
      customerID,
      subject,
      description,
    });

    res.status(201).json({
      message: "Support ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all support tickets (admin only)
export const getAllSupportTicketsController = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await getAllSupportTicketsService();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching all support tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get tickets by customer ID
export const getTicketsByCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const customerID = Number(req.params.customerID);

    if (isNaN(customerID)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const tickets = await getTicketsByCustomerService(customerID);
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching customer tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single support ticket by ID
export const getSupportTicketByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const ticketID = Number(req.params.id);

    if (isNaN(ticketID)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await getSupportTicketByIdService(ticketID);

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update support ticket status
export const updateSupportTicketStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const ticketID = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(ticketID)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    if (
      !status ||
      !["Open", "In Progress", "Resolved", "Closed"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Valid status is required (Open, In Progress, Resolved, Closed)",
      });
    }

    const updatedTicket = await updateSupportTicketStatusService(
      ticketID,
      status
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.status(200).json({
      message: "Support ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating support ticket status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete support ticket
export const deleteSupportTicketController = async (
  req: Request,
  res: Response
) => {
  try {
    const ticketID = Number(req.params.id);

    if (isNaN(ticketID)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const deletedTicket = await deleteSupportTicketService(ticketID);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.status(200).json({
      message: "Support ticket deleted successfully",
      ticket: deletedTicket,
    });
  } catch (error) {
    console.error("Error deleting support ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get tickets by status
export const getTicketsByStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.params;

    if (!["Open", "In Progress", "Resolved", "Closed"].includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Valid statuses: Open, In Progress, Resolved, Closed",
      });
    }

    const tickets = await getTicketsByStatusService(
      status as "Open" | "In Progress" | "Resolved" | "Closed"
    );
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets by status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
