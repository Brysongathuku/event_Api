import { eq, desc, asc } from "drizzle-orm";
import db from "../Drizzle/db";
import { CustomerSupportTicketsTable, CustomersTable } from "../Drizzle/schema";
import { TISupportTicket, TSSupportTicket } from "../Drizzle/schema";

// Create a new support ticket
export const createSupportTicketService = async (ticketData: TISupportTicket) => {
    try {
        const [newTicket] = await db.insert(CustomerSupportTicketsTable)
            .values(ticketData)
            .returning();
        
        return newTicket;
    } catch (error) {
        console.error("Error in createSupportTicketService:", error);
        throw error;
    }
};

// Get all support tickets (admin only)
export const getAllSupportTicketsService = async () => {
    try {
        const tickets = await db.query.CustomerSupportTicketsTable.findMany({
            with: {
                customer: {
                    columns: {
                        customerID: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        contactPhone: true
                    }
                }
            },
            orderBy: [desc(CustomerSupportTicketsTable.createdAt)]
        });

        return tickets;
    } catch (error) {
        console.error("Error in getAllSupportTicketsService:", error);
        throw error;
    }
};

// Get tickets by customer ID
export const getTicketsByCustomerService = async (customerID: number) => {
    try {
        const tickets = await db.query.CustomerSupportTicketsTable.findMany({
            where: eq(CustomerSupportTicketsTable.customerID, customerID),
            orderBy: [desc(CustomerSupportTicketsTable.createdAt)]
        });

        return tickets;
    } catch (error) {
        console.error("Error in getTicketsByCustomerService:", error);
        throw error;
    }
};

// Get single support ticket by ID
export const getSupportTicketByIdService = async (ticketID: number) => {
    try {
        const ticket = await db.query.CustomerSupportTicketsTable.findFirst({
            where: eq(CustomerSupportTicketsTable.ticketID, ticketID),
            with: {
                customer: {
                    columns: {
                        customerID: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        contactPhone: true
                    }
                }
            }
        });

        return ticket;
    } catch (error) {
        console.error("Error in getSupportTicketByIdService:", error);
        throw error;
    }
};

// Update support ticket status
export const updateSupportTicketStatusService = async (
    ticketID: number, 
    status: "Open" | "In Progress" | "Resolved" | "Closed"
) => {
    try {
        const [updatedTicket] = await db.update(CustomerSupportTicketsTable)
            .set({ 
                status: status,
                updatedAt: new Date()
            })
            .where(eq(CustomerSupportTicketsTable.ticketID, ticketID))
            .returning();

        return updatedTicket;
    } catch (error) {
        console.error("Error in updateSupportTicketStatusService:", error);
        throw error;
    }
};

// Delete support ticket
export const deleteSupportTicketService = async (ticketID: number) => {
    try {
        const [deletedTicket] = await db.delete(CustomerSupportTicketsTable)
            .where(eq(CustomerSupportTicketsTable.ticketID, ticketID))
            .returning();

        return deletedTicket;
    } catch (error) {
        console.error("Error in deleteSupportTicketService:", error);
        throw error;
    }
};

// Get tickets by status
export const getTicketsByStatusService = async (status: "Open" | "In Progress" | "Resolved" | "Closed") => {
    try {
        const tickets = await db.query.CustomerSupportTicketsTable.findMany({
            where: eq(CustomerSupportTicketsTable.status, status),
            with: {
                customer: {
                    columns: {
                        customerID: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        contactPhone: true
                    }
                }
            },
            orderBy: [desc(CustomerSupportTicketsTable.createdAt)]
        });

        return tickets;
    } catch (error) {
        console.error("Error in getTicketsByStatusService:", error);
        throw error;
    }
};