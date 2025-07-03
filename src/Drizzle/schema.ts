import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import {
  text,
  varchar,
  serial,
  pgTable,
  decimal,
  integer,
  boolean,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

// Role Enum -
export const RoleEnum = pgEnum("role", ["admin", "user"]);

// Payment Status Enum
export const PaymentStatusEnum = pgEnum("payment_status", [
  "Pending",
  "Completed",
  "Failed",
  "Refunded",
]);

// Ticket Status Enum
export const TicketStatusEnum = pgEnum("ticket_status", [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
]);

// Customers Table
export const CustomersTable = pgTable("customers", {
  customerID: serial("customerID").primaryKey(),
  firstName: varchar("firstName", { length: 50 }).notNull(),
  lastName: varchar("lastName", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  role: RoleEnum("role").default("user"),
  isVerified: boolean("is_verified").default(false),
  verificationCode: varchar("verification_code", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Venues Table
export const VenuesTable = pgTable("venues", {
  venueID: serial("venueID").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  contactNumber: varchar("contact_number", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events Table
export const EventsTable = pgTable("events", {
  eventID: serial("eventID").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  ticketPrice: decimal("ticket_price", { precision: 10, scale: 2 }).notNull(),
  availableTickets: integer("available_tickets").notNull(),
  totalTickets: integer("total_tickets").notNull(),
  isActive: boolean("is_active").default(true),
  venueID: integer("venueID").references(() => VenuesTable.venueID, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings Table
export const BookingsTable = pgTable("bookings", {
  bookingID: serial("bookingID").primaryKey(),
  customerID: integer("customerID")
    .notNull()
    .references(() => CustomersTable.customerID, { onDelete: "cascade" }),
  eventID: integer("eventID")
    .notNull()
    .references(() => EventsTable.eventID, { onDelete: "cascade" }),
  numberOfTickets: integer("number_of_tickets").notNull().default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  bookingDate: timestamp("booking_date").defaultNow(),
  bookingStatus: varchar("booking_status", { length: 20 }).default("Confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments Table

export const PaymentsTable = pgTable("payments", {
  paymentID: serial("paymentID").primaryKey(),
  customerID: integer("customerID")
    .notNull()
    .references(() => CustomersTable.customerID, { onDelete: "cascade" }),
  bookingID: integer("bookingID")
    .notNull()
    .references(() => BookingsTable.bookingID, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: PaymentStatusEnum("payment_status").default("Pending"),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionID: varchar("transaction_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Support Tickets Table
export const CustomerSupportTicketsTable = pgTable("customer_support_tickets", {
  ticketID: serial("ticketID").primaryKey(),
  customerID: integer("customerID")
    .notNull()
    .references(() => CustomersTable.customerID, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 200 }).notNull(),
  description: text("description").notNull(),
  status: TicketStatusEnum("status").default("Open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RELATIONSHIPS

// CustomersTable Relationships - 1 customer can have many bookings and support tickets
export const CustomersRelations = relations(CustomersTable, ({ many }) => ({
  bookings: many(BookingsTable),
  supportTickets: many(CustomerSupportTicketsTable),
}));

// VenuesTable Relationships - 1 venue can have many events
export const VenuesRelations = relations(VenuesTable, ({ many }) => ({
  events: many(EventsTable),
}));

// EventsTable Relationships - 1 event belongs to 1 venue and can have many bookings
export const EventsRelations = relations(EventsTable, ({ many, one }) => ({
  venue: one(VenuesTable, {
    fields: [EventsTable.venueID],
    references: [VenuesTable.venueID],
  }),
  bookings: many(BookingsTable),
}));

// BookingsTable Relationships - 1 booking belongs to 1 customer and 1 event, and has one payment
export const BookingsRelations = relations(BookingsTable, ({ one }) => ({
  customer: one(CustomersTable, {
    fields: [BookingsTable.customerID],
    references: [CustomersTable.customerID],
  }),
  event: one(EventsTable, {
    fields: [BookingsTable.eventID],
    references: [EventsTable.eventID],
  }),
  payment: one(PaymentsTable, {
    fields: [BookingsTable.bookingID],
    references: [PaymentsTable.bookingID],
  }),
}));

// PaymentsTable Relationships - 1 payment belongs to 1 booking
export const PaymentsRelations = relations(PaymentsTable, ({ one }) => ({
  booking: one(BookingsTable, {
    fields: [PaymentsTable.bookingID],
    references: [BookingsTable.bookingID],
  }),
}));

// CustomerSupportTicketsTable Relationships - 1 ticket belongs to 1 customer
export const CustomerSupportTicketsRelations = relations(
  CustomerSupportTicketsTable,
  ({ one }) => ({
    customer: one(CustomersTable, {
      fields: [CustomerSupportTicketsTable.customerID],
      references: [CustomersTable.customerID],
    }),
  })
);

// Types
export type TICustomer = typeof CustomersTable.$inferInsert;
export type TSCustomer = typeof CustomersTable.$inferSelect;

// Login input type
export type TSCustomerLoginInput = {
  email: string;
  password: string;
};

export type TIVenue = typeof VenuesTable.$inferInsert;
export type TSVenue = typeof VenuesTable.$inferSelect;

export type TIEvent = typeof EventsTable.$inferInsert;
export type TSEvent = typeof EventsTable.$inferSelect;

export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;

export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

export type TISupportTicket = typeof CustomerSupportTicketsTable.$inferInsert;
export type TSSupportTicket = typeof CustomerSupportTicketsTable.$inferSelect;
