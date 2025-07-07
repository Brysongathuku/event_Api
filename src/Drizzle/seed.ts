import db from "./db";
import {
  CustomersTable,
  VenuesTable,
  EventsTable,
  BookingsTable,
  PaymentsTable,
  CustomerSupportTicketsTable,
} from "./schema";

async function seed() {
  console.log("Seeding to database started...");

  // insert venues
  await db.insert(VenuesTable).values([
    {
      name: "Nairobi Convention Centre",
      address: "123 Harambee Avenue, Nairobi",
      capacity: 5000,
      contactNumber: "1234567890",
    },
    {
      name: "KICC Auditorium",
      address: "City Hall Way, Nairobi",
      capacity: 2500,
      contactNumber: "0987654321",
    },
    {
      name: "Eldoret Sports Club",
      address: "Uganda Road, Eldoret",
      capacity: 1200,
      contactNumber: "5555555555",
    },
    {
      name: "Nakuru ASK Showground",
      address: "Kenyatta Avenue, Nakuru",
      capacity: 8000,
      contactNumber: "2223334444",
    },
    {
      name: "Mombasa Memorial Hall",
      address: "Mama Ngina Drive, Mombasa",
      capacity: 1500,
      contactNumber: "6667778888",
    },
  ]);

  // insert customers
  await db.insert(CustomersTable).values([
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "mypassword",
      contactPhone: "555-1234",
      address: "1 Elm St, Nairobi",
      role: "user",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: "mypassword",
      contactPhone: "555-5678",
      address: "2 Maple Ave, Eldoret",
      role: "user",
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      password: "mypassword",
      contactPhone: "555-8765",
      address: "3 Oak Dr, Nakuru",
      role: "user",
    },
    {
      firstName: "Bob",
      lastName: "Brown",
      email: "bob@example.com",
      password: "mypassword",
      contactPhone: "555-4321",
      address: "4 Birch Ln, Mombasa",
      role: "user",
    },
    {
      firstName: "Charlie",
      lastName: "Miller",
      email: "charlie@example.com",
      password: "mypassword",
      contactPhone: "555-9999",
      address: "5 Cedar Rd, Kisumu",
      role: "admin",
    },
  ]);

  // insert events
  await db.insert(EventsTable).values([
    {
      title: "Kenya Music Festival 2024",
      description:
        "Annual music festival featuring local and international artists",
      eventDate: "2024-12-15T18:00:00.000Z",
      startTime: "2024-12-15T18:00:00.000Z",
      endTime: "2024-12-15T23:00:00.000Z",
      ticketPrice: "2500.00",
      availableTickets: 4500,
      totalTickets: 5000,
      isActive: true,
      venueID: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Tech Conference Nairobi",
      description: "Leading technology conference in East Africa",
      eventDate: "2024-11-20T09:00:00.000Z",
      startTime: "2024-11-20T09:00:00.000Z",
      endTime: "2024-11-20T17:00:00.000Z",
      ticketPrice: "5000.00",
      availableTickets: 2300,
      totalTickets: 2500,
      isActive: true,
      venueID: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Comedy Night Eldoret",
      description: "Stand-up comedy show with top Kenyan comedians",
      eventDate: "2024-10-30T19:30:00.000Z",
      startTime: "2024-10-30T19:30:00.000Z",
      endTime: "2024-10-30T22:30:00.000Z",
      ticketPrice: "1500.00",
      availableTickets: 1000,
      totalTickets: 1200,
      isActive: true,
      venueID: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Agricultural Trade Fair",
      description: "Annual agricultural exhibition and trade fair",
      eventDate: "2024-09-25T08:00:00.000Z",
      startTime: "2024-09-25T08:00:00.000Z",
      endTime: "2024-09-25T18:00:00.000Z",
      ticketPrice: "500.00",
      availableTickets: 7500,
      totalTickets: 8000,
      isActive: true,
      venueID: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Coastal Cultural Festival",
      description: "Celebration of coastal culture, food, and traditions",
      eventDate: "2024-08-18T16:00:00.000Z",
      startTime: "2024-08-18T16:00:00.000Z",
      endTime: "2024-08-18T22:00:00.000Z",
      ticketPrice: "1200.00",
      availableTickets: 1200,
      totalTickets: 1500,
      isActive: true,
      venueID: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // insert bookings
  await db.insert(BookingsTable).values([
    {
      customerID: 1,
      eventID: 1,
      numberOfTickets: 2,
      totalAmount: "5000.00",
      bookingStatus: "Confirmed",
    },
    {
      customerID: 2,
      eventID: 2,
      numberOfTickets: 1,
      totalAmount: "5000.00",
      bookingStatus: "Confirmed",
    },
    {
      customerID: 3,
      eventID: 3,
      numberOfTickets: 4,
      totalAmount: "6000.00",
      bookingStatus: "Confirmed",
    },
    {
      customerID: 4,
      eventID: 4,
      numberOfTickets: 3,
      totalAmount: "1500.00",
      bookingStatus: "Confirmed",
    },
    {
      customerID: 1,
      eventID: 5,
      numberOfTickets: 2,
      totalAmount: "2400.00",
      bookingStatus: "Pending",
    },
  ]);
  // insert payments
  await db.insert(PaymentsTable).values([
    {
      customerID: 1,
      bookingID: 1,
      amount: "5000.00",
      paymentStatus: "Completed",
      paymentMethod: "M-Pesa",
      transactionID: "MP240601001",
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      customerID: 2,
      bookingID: 2,
      amount: "5000.00",
      paymentStatus: "Completed",
      paymentMethod: "Credit Card",
      transactionID: "CC240602002",
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      customerID: 3,
      bookingID: 3,
      amount: "6000.00",
      paymentStatus: "Completed",
      paymentMethod: "Bank Transfer",
      transactionID: "BT240603003",
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      customerID: 4,
      bookingID: 4,
      amount: "1500.00",
      paymentStatus: "Completed",
      paymentMethod: "M-Pesa",
      transactionID: "MP240604004",
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      customerID: 5,
      bookingID: 5,
      amount: "2400.00",
      paymentStatus: "Pending",
      paymentMethod: "M-Pesa",
      transactionID: "MP240605005",
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // insert customer support tickets
  await db.insert(CustomerSupportTicketsTable).values([
    {
      customerID: 1,
      subject: "Unable to download tickets",
      description:
        "I paid for my tickets but cannot download them from my account",
      status: "Open",
    },
    {
      customerID: 2,
      subject: "Event cancellation inquiry",
      description:
        "I heard rumors that the tech conference might be cancelled. Is this true?",
      status: "In Progress",
    },
    {
      customerID: 3,
      subject: "Refund request",
      description:
        "I need to cancel my booking due to emergency. How do I get a refund?",
      status: "Resolved",
    },
    {
      customerID: 4,
      subject: "Venue location clarification",
      description:
        "Can you provide more detailed directions to the Agricultural Trade Fair venue?",
      status: "Closed",
    },
    {
      customerID: 1,
      subject: "Group booking discount",
      description:
        "Do you offer discounts for group bookings of more than 10 tickets?",
      status: "Open",
    },
  ]);

  console.log("Seeding to database completed successfully.");
  process.exit(0); // 0 means success
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1); // 1 means an error occurred
});
