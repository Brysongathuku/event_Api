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

  // Clear existing data (optional - use with caution in production)
  await db.delete(CustomerSupportTicketsTable);
  await db.delete(PaymentsTable);
  await db.delete(BookingsTable);
  await db.delete(EventsTable);
  await db.delete(VenuesTable);
  await db.delete(CustomersTable);

  // Insert venues
  const venues = await db
    .insert(VenuesTable)
    .values([
      {
        venueName: "Nairobi Convention Centre",
        address: "123 Harambee Avenue, Nairobi",
        description:
          "Modern convention center in the heart of Nairobi with state-of-the-art facilities",
        capacity: 5000,
        imageUrl:
          "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
      {
        venueName: "KICC Auditorium",
        address: "City Hall Way, Nairobi",
        description:
          "Iconic conference center with panoramic city views and excellent acoustics",
        capacity: 2500,
        imageUrl:
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1412&q=80",
      },
      {
        venueName: "Eldoret Sports Club",
        address: "Uganda Road, Eldoret",
        description:
          "Premier sports and events facility in Western Kenya with outdoor and indoor spaces",
        capacity: 1200,
        imageUrl:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80",
      },
      {
        venueName: "Nakuru ASK Showground",
        address: "Kenyatta Avenue, Nakuru",
        description:
          "Large exhibition grounds perfect for trade shows, fairs, and large gatherings",
        capacity: 8000,
        imageUrl:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
      {
        venueName: "Mombasa Memorial Hall",
        address: "Mama Ngina Drive, Mombasa",
        description:
          "Historic coastal venue with ocean views and traditional architecture",
        capacity: 1500,
        imageUrl:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
    ])
    .returning();

  // Insert customers
  const customers = await db
    .insert(CustomersTable)
    .values([
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW", // hashed "mypassword"
        contactPhone: "555-1234",
        address: "1 Elm St, Nairobi",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "555-5678",
        address: "2 Maple Ave, Eldoret",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@example.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "555-8765",
        address: "3 Oak Dr, Nakuru",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "Bob",
        lastName: "Brown",
        email: "bob@example.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "555-4321",
        address: "4 Birch Ln, Mombasa",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "Charlie",
        lastName: "Miller",
        email: "charlie@example.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "555-9999",
        address: "5 Cedar Rd, Kisumu",
        role: "admin",
        isVerified: true,
      },
    ])
    .returning();

  // Insert events
  const events = await db
    .insert(EventsTable)
    .values([
      {
        title: "Kenya Music Festival 2024",
        description:
          "Annual music festival featuring top local and international artists across multiple genres. Three-day event with food stalls and merchandise.",
        eventDate: "2024-12-15T18:00:00.000Z",
        startTime: "2024-12-15T18:00:00.000Z",
        endTime: "2024-12-15T23:00:00.000Z",
        ticketPrice: "2500.00",
        availableTickets: 4500,
        totalTickets: 5000,
        isActive: true,
        venueID: venues[0].venueID,
        imageUrl:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Tech Conference Nairobi",
        description:
          "Leading technology conference in East Africa covering AI, blockchain, and emerging technologies. Keynote speakers from global tech companies.",
        eventDate: "2024-11-20T09:00:00.000Z",
        startTime: "2024-11-20T09:00:00.000Z",
        endTime: "2024-11-20T17:00:00.000Z",
        ticketPrice: "5000.00",
        availableTickets: 2300,
        totalTickets: 2500,
        isActive: true,
        venueID: venues[1].venueID,
        imageUrl:
          "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Comedy Night Eldoret",
        description:
          "Stand-up comedy show featuring Kenya's top comedians. Relaxed atmosphere with food and drinks available. Age 18+ event.",
        eventDate: "2024-10-30T19:30:00.000Z",
        startTime: "2024-10-30T19:30:00.000Z",
        endTime: "2024-10-30T22:30:00.000Z",
        ticketPrice: "1500.00",
        availableTickets: 1000,
        totalTickets: 1200,
        isActive: true,
        venueID: venues[2].venueID,
        imageUrl:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Agricultural Trade Fair",
        description:
          "Annual agricultural exhibition showcasing the latest farming technologies, livestock competitions, and trade opportunities.",
        eventDate: "2024-09-25T08:00:00.000Z",
        startTime: "2024-09-25T08:00:00.000Z",
        endTime: "2024-09-25T18:00:00.000Z",
        ticketPrice: "500.00",
        availableTickets: 7500,
        totalTickets: 8000,
        isActive: true,
        venueID: venues[3].venueID,
        imageUrl:
          "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      },
      {
        title: "Coastal Cultural Festival",
        description:
          "Vibrant celebration of coastal culture featuring traditional music, dance, food, and crafts. Family-friendly event with activities for all ages.",
        eventDate: "2024-08-18T16:00:00.000Z",
        startTime: "2024-08-18T16:00:00.000Z",
        endTime: "2024-08-18T22:00:00.000Z",
        ticketPrice: "1200.00",
        availableTickets: 1200,
        totalTickets: 1500,
        isActive: true,
        venueID: venues[4].venueID,
        imageUrl:
          "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
    ])
    .returning();

  // Insert bookings
  const bookings = await db
    .insert(BookingsTable)
    .values([
      {
        customerID: customers[0].customerID,
        eventID: events[0].eventID,
        numberOfTickets: 2,
        totalAmount: "5000.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[1].customerID,
        eventID: events[1].eventID,
        numberOfTickets: 1,
        totalAmount: "5000.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[2].customerID,
        eventID: events[2].eventID,
        numberOfTickets: 4,
        totalAmount: "6000.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[3].customerID,
        eventID: events[3].eventID,
        numberOfTickets: 3,
        totalAmount: "1500.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[0].customerID,
        eventID: events[4].eventID,
        numberOfTickets: 2,
        totalAmount: "2400.00",
        bookingStatus: "Pending",
      },
    ])
    .returning();

  // Insert payments
  await db.insert(PaymentsTable).values([
    {
      customerID: customers[0].customerID,
      bookingID: bookings[0].bookingID,
      amount: "5000.00",
      paymentStatus: "Completed",
      paymentMethod: "M-Pesa",
      transactionID: "MP240601001",
    },
    {
      customerID: customers[1].customerID,
      bookingID: bookings[1].bookingID,
      amount: "5000.00",
      paymentStatus: "Completed",
      paymentMethod: "Credit Card",
      transactionID: "CC240602002",
    },
    {
      customerID: customers[2].customerID,
      bookingID: bookings[2].bookingID,
      amount: "6000.00",
      paymentStatus: "Completed",
      paymentMethod: "Bank Transfer",
      transactionID: "BT240603003",
    },
    {
      customerID: customers[3].customerID,
      bookingID: bookings[3].bookingID,
      amount: "1500.00",
      paymentStatus: "Completed",
      paymentMethod: "M-Pesa",
      transactionID: "MP240604004",
    },
    {
      customerID: customers[4].customerID,
      bookingID: bookings[4].bookingID,
      amount: "2400.00",
      paymentStatus: "Pending",
      paymentMethod: "M-Pesa",
      transactionID: "MP240605005",
    },
  ]);

  // Insert customer support tickets
  await db.insert(CustomerSupportTicketsTable).values([
    {
      customerID: customers[0].customerID,
      subject: "Unable to download tickets",
      description:
        "I paid for my tickets but cannot download them from my account. The download button is grayed out.",
      status: "Open",
    },
    {
      customerID: customers[1].customerID,
      subject: "Event cancellation inquiry",
      description:
        "I heard rumors that the tech conference might be cancelled due to speaker availability. Can you confirm if this is true?",
      status: "In Progress",
    },
    {
      customerID: customers[2].customerID,
      subject: "Refund request",
      description:
        "I need to cancel my booking due to a family emergency. What is the refund policy and process?",
      status: "Resolved",
    },
    {
      customerID: customers[3].customerID,
      subject: "Venue location clarification",
      description:
        "The map link for the Agricultural Trade Fair seems incorrect. Can you provide the exact GPS coordinates?",
      status: "Closed",
    },
    {
      customerID: customers[0].customerID,
      subject: "Group booking discount",
      description:
        "We want to book 15 tickets for our team. Do you offer any group discounts for this quantity?",
      status: "Open",
    },
  ]);

  console.log("Seeding to database completed successfully.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
