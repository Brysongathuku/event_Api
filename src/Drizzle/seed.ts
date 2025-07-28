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
  console.log("Seeding Las Vegas events database started...");

  // Clear existing data (optional - use with caution in production)
  await db.delete(CustomerSupportTicketsTable);
  await db.delete(PaymentsTable);
  await db.delete(BookingsTable);
  await db.delete(EventsTable);
  await db.delete(VenuesTable);
  await db.delete(CustomersTable);

  // Insert Las Vegas venues
  const venues = await db
    .insert(VenuesTable)
    .values([
      {
        venueName: "MGM Grand Garden Arena",
        address: "3799 S Las Vegas Blvd, Las Vegas, NV 89109",
        description:
          "Premier entertainment venue in the heart of the Strip, hosting major concerts, boxing matches, and special events",
        capacity: 17000,
        imageUrl:
          "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        venueName: "T-Mobile Arena",
        address: "3780 S Las Vegas Blvd, Las Vegas, NV 89158",
        description:
          "State-of-the-art arena featuring the latest technology and premium amenities for world-class entertainment",
        capacity: 20000,
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        venueName: "Bellagio Conservatory & Botanical Gardens",
        address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
        description:
          "Elegant botanical venue perfect for intimate concerts and cultural events surrounded by stunning floral displays",
        capacity: 2500,
        imageUrl:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        venueName: "Las Vegas Convention Center",
        address: "3150 Paradise Rd, Las Vegas, NV 89109",
        description:
          "Massive convention facility hosting trade shows, exhibitions, and large-scale corporate events",
        capacity: 15000,
        imageUrl:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        venueName: "The Venetian Theatre",
        address: "3355 S Las Vegas Blvd, Las Vegas, NV 89109",
        description:
          "Luxurious theater venue with Italian-inspired architecture, perfect for Broadway shows and intimate performances",
        capacity: 1800,
        imageUrl:
          "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
      },
      {
        venueName: "Red Rock Canyon Amphitheatre",
        address: "Red Rock Canyon National Conservation Area, Las Vegas, NV",
        description:
          "Stunning outdoor venue with natural rock formations providing a unique backdrop for concerts and festivals",
        capacity: 8500,
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        venueName: "Mandalay Bay Events Center",
        address: "3950 S Las Vegas Blvd, Las Vegas, NV 89119",
        description:
          "Versatile event space with panoramic views of the Strip, ideal for galas, conferences, and special celebrations",
        capacity: 12000,
        imageUrl:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
      },
    ])
    .returning();

  // Insert customers with diverse profiles
  const customers = await db
    .insert(CustomersTable)
    .values([
      {
        firstName: "Marcus",
        lastName: "Rodriguez",
        email: "marcus.rodriguez@gmail.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "+1-702-555-0101",
        address: "1250 Sunset Boulevard, Las Vegas, NV 89102",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "Sophia",
        lastName: "Chen",
        email: "sophia.chen@yahoo.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "+1-702-555-0202",
        address: "3847 Paradise Road, Las Vegas, NV 89169",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b515?w=400",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "James",
        lastName: "Thompson",
        email: "j.thompson@outlook.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "+1-702-555-0303",
        address: "5821 Charleston Boulevard, Las Vegas, NV 89146",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "Isabella",
        lastName: "Martinez",
        email: "bella.martinez@hotmail.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "+1-702-555-0404",
        address: "2156 Eastern Avenue, Las Vegas, NV 89104",
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@gmail.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "+1-702-555-0505",
        address: "4982 Tropicana Avenue, Las Vegas, NV 89103",
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        role: "admin",
        isVerified: true,
      },
      {
        firstName: "Emma",
        lastName: "Johnson",
        email: "emma.j@icloud.com",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "+1-702-555-0606",
        address: "1738 Sahara Avenue, Las Vegas, NV 89104",
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        role: "user",
        isVerified: true,
      },
      {
        firstName: "Ryan",
        lastName: "Garcia",
        email: "ryan.garcia@proton.me",
        password:
          "$2b$10$E3YRHbJ5z6UZ7Q3pQdL6E.XrXxGZ5Jz8VlYJQkHd7Nc1rKvY6sWQW",
        contactPhone: "+1-702-555-0707",
        address: "6429 Spring Mountain Road, Las Vegas, NV 89146",
        imageUrl:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
        role: "user",
        isVerified: false,
      },
    ])
    .returning();

  // Insert exciting Las Vegas events
  const events = await db
    .insert(EventsTable)
    .values([
      {
        title: "Neon Nights Music Festival 2024",
        description:
          "The ultimate electronic dance music festival featuring world-renowned DJs including Calvin Harris, Tiësto, and Deadmau5. Three stages, spectacular light shows, and VIP experiences available. 21+ event with premium bars and food vendors.",
        eventDate: "2024-12-31T20:00:00.000Z",
        startTime: "2024-12-31T20:00:00.000Z",
        endTime: "2025-01-01T06:00:00.000Z",
        ticketPrice: "299.99",
        availableTickets: 15000,
        totalTickets: 17000,
        isActive: true,
        venueID: venues[0].venueID, // MGM Grand Garden Arena
        imageUrl:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Championship Boxing: Thunder vs Lightning",
        description:
          "Heavyweight championship bout featuring two undefeated fighters in an epic showdown. Premium seating includes ringside tables with champagne service. Undercard features rising stars in multiple weight classes.",
        eventDate: "2024-11-15T21:00:00.000Z",
        startTime: "2024-11-15T21:00:00.000Z",
        endTime: "2025-11-16T01:00:00.000Z",
        ticketPrice: "450.00",
        availableTickets: 18500,
        totalTickets: 20000,
        isActive: true,
        venueID: venues[1].venueID, // T-Mobile Arena
        imageUrl:
          "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      },
      {
        title: "Broadway Spectacular: The Phantom Returns",
        description:
          "Limited engagement of the beloved musical featuring original Broadway cast members. Stunning costumes, elaborate sets, and the timeless music that has captivated audiences for decades. Premium dinner packages available.",
        eventDate: "2024-10-20T19:30:00.000Z",
        startTime: "2024-10-20T19:30:00.000Z",
        endTime: "2024-10-20T22:00:00.000Z",
        ticketPrice: "185.00",
        availableTickets: 1600,
        totalTickets: 1800,
        isActive: true,
        venueID: venues[4].venueID, // The Venetian Theatre
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Vegas Tech Summit 2024",
        description:
          "Premier technology conference bringing together industry leaders, startups, and investors. Keynotes on AI, blockchain, gaming technology, and the future of digital entertainment. Networking events and startup pitch competitions included.",
        eventDate: "2024-09-25T08:00:00.000Z",
        startTime: "2024-09-25T08:00:00.000Z",
        endTime: "2024-09-27T18:00:00.000Z",
        ticketPrice: "795.00",
        availableTickets: 12000,
        totalTickets: 15000,
        isActive: true,
        venueID: venues[3].venueID, // Las Vegas Convention Center
        imageUrl:
          "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Desert Sunrise Classical Concert",
        description:
          "Breathtaking outdoor classical music experience featuring the Las Vegas Philharmonic against the stunning Red Rock backdrop. Gates open at 5 AM for sunrise viewing, concert begins at dawn. Complimentary breakfast and coffee service.",
        eventDate: "2024-08-18T06:00:00.000Z",
        startTime: "2024-08-18T06:00:00.000Z",
        endTime: "2024-08-18T09:00:00.000Z",
        ticketPrice: "125.00",
        availableTickets: 7500,
        totalTickets: 8500,
        isActive: true,
        venueID: venues[5].venueID, // Red Rock Canyon Amphitheatre
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Spring Garden Gala",
        description:
          "Exclusive charity gala in the magnificent Bellagio Conservatory featuring live jazz music, gourmet dining, and silent auction. Black-tie optional event supporting local environmental conservation efforts.",
        eventDate: "2024-07-12T18:00:00.000Z",
        startTime: "2024-07-12T18:00:00.000Z",
        endTime: "2024-07-12T23:00:00.000Z",
        ticketPrice: "350.00",
        availableTickets: 2200,
        totalTickets: 2500,
        isActive: true,
        venueID: venues[2].venueID, // Bellagio Conservatory
        imageUrl:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "Vegas Comedy Roast Extravaganza",
        description:
          "Hilarious comedy show featuring top comedians roasting Vegas celebrities and local personalities. Adults-only event with cocktail service and late-night dining options. Special surprise guest appearances.",
        eventDate: "2024-06-08T22:00:00.000Z",
        startTime: "2024-06-08T22:00:00.000Z",
        endTime: "2024-06-09T01:00:00.000Z",
        ticketPrice: "89.99",
        availableTickets: 10500,
        totalTickets: 12000,
        isActive: true,
        venueID: venues[6].venueID, // Mandalay Bay Events Center
        imageUrl:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        title: "International Food & Wine Festival",
        description:
          "Culinary celebration featuring celebrity chefs, wine tastings from around the world, and cooking demonstrations. VIP experiences include private chef tables and premium wine pairings. Weekend-long event with multiple sessions.",
        eventDate: "2024-05-17T11:00:00.000Z",
        startTime: "2024-05-17T11:00:00.000Z",
        endTime: "2024-05-19T22:00:00.000Z",
        ticketPrice: "165.00",
        availableTickets: 8900,
        totalTickets: 12000,
        isActive: true,
        venueID: venues[6].venueID, // Mandalay Bay Events Center
        imageUrl:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
    ])
    .returning();

  // Insert realistic bookings
  const bookings = await db
    .insert(BookingsTable)
    .values([
      {
        customerID: customers[0].customerID,
        eventID: events[0].eventID, // Neon Nights Music Festival
        numberOfTickets: 2,
        totalAmount: "599.98",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[1].customerID,
        eventID: events[1].eventID, // Championship Boxing
        numberOfTickets: 1,
        totalAmount: "450.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[2].customerID,
        eventID: events[2].eventID, // Broadway Spectacular
        numberOfTickets: 4,
        totalAmount: "740.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[3].customerID,
        eventID: events[3].eventID, // Vegas Tech Summit
        numberOfTickets: 1,
        totalAmount: "795.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[4].customerID,
        eventID: events[4].eventID, // Desert Sunrise Classical
        numberOfTickets: 2,
        totalAmount: "250.00",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[5].customerID,
        eventID: events[5].eventID, // Spring Garden Gala
        numberOfTickets: 2,
        totalAmount: "700.00",
        bookingStatus: "Pending",
      },
      {
        customerID: customers[0].customerID,
        eventID: events[6].eventID, // Comedy Roast
        numberOfTickets: 3,
        totalAmount: "269.97",
        bookingStatus: "Confirmed",
      },
      {
        customerID: customers[6].customerID,
        eventID: events[7].eventID, // Food & Wine Festival
        numberOfTickets: 2,
        totalAmount: "330.00",
        bookingStatus: "Confirmed",
      },
    ])
    .returning();

  // Insert payments with various methods popular in Vegas
  await db.insert(PaymentsTable).values([
    {
      customerID: customers[0].customerID,
      bookingID: bookings[0].bookingID,
      amount: "599.98",
      paymentStatus: "Completed",
      paymentMethod: "Credit Card",
      transactionID: "CC_LV_2024_001001",
    },
    {
      customerID: customers[1].customerID,
      bookingID: bookings[1].bookingID,
      amount: "450.00",
      paymentStatus: "Completed",
      paymentMethod: "PayPal",
      transactionID: "PP_LV_2024_001002",
    },
    {
      customerID: customers[2].customerID,
      bookingID: bookings[2].bookingID,
      amount: "740.00",
      paymentStatus: "Completed",
      paymentMethod: "Credit Card",
      transactionID: "CC_LV_2024_001003",
    },
    {
      customerID: customers[3].customerID,
      bookingID: bookings[3].bookingID,
      amount: "795.00",
      paymentStatus: "Completed",
      paymentMethod: "Bank Transfer",
      transactionID: "BT_LV_2024_001004",
    },
    {
      customerID: customers[4].customerID,
      bookingID: bookings[4].bookingID,
      amount: "250.00",
      paymentStatus: "Completed",
      paymentMethod: "Apple Pay",
      transactionID: "AP_LV_2024_001005",
    },
    {
      customerID: customers[5].customerID,
      bookingID: bookings[5].bookingID,
      amount: "700.00",
      paymentStatus: "Pending",
      paymentMethod: "Credit Card",
      transactionID: "CC_LV_2024_001006",
    },
    {
      customerID: customers[0].customerID,
      bookingID: bookings[6].bookingID,
      amount: "269.97",
      paymentStatus: "Completed",
      paymentMethod: "Google Pay",
      transactionID: "GP_LV_2024_001007",
    },
    {
      customerID: customers[6].customerID,
      bookingID: bookings[7].bookingID,
      amount: "330.00",
      paymentStatus: "Completed",
      paymentMethod: "Credit Card",
      transactionID: "CC_LV_2024_001008",
    },
  ]);

  // Insert customer support tickets with Vegas-specific scenarios
  await db.insert(CustomerSupportTicketsTable).values([
    {
      customerID: customers[0].customerID,
      subject: "VIP Package Upgrade Request",
      description:
        "Hi, I purchased regular tickets for the Neon Nights Music Festival but would like to upgrade to VIP. Can someone help me with the upgrade process and additional costs?",
      status: "Open",
    },
    {
      customerID: customers[1].customerID,
      subject: "Parking Information for T-Mobile Arena",
      description:
        "I'm attending the boxing match and need information about parking options near T-Mobile Arena. Are there any partner hotels offering shuttle services?",
      status: "In Progress",
    },
    {
      customerID: customers[2].customerID,
      subject: "Accessibility Seating Request",
      description:
        "I need wheelchair accessible seating for The Phantom Returns show. I already have tickets but need to modify my seating arrangement. Can you please assist?",
      status: "Resolved",
    },
    {
      customerID: customers[3].customerID,
      subject: "Corporate Group Discount",
      description:
        "Our company wants to purchase 25 tickets for the Vegas Tech Summit. Do you offer corporate group discounts for bulk purchases? We need an invoice for expense reporting.",
      status: "In Progress",
    },
    {
      customerID: customers[4].customerID,
      subject: "Weather Concerns for Outdoor Event",
      description:
        "I'm concerned about weather conditions for the Desert Sunrise Classical Concert. What happens if there's rain or extreme weather? Is there a refund policy?",
      status: "Closed",
    },
    {
      customerID: customers[5].customerID,
      subject: "Dress Code Clarification",
      description:
        "I'm attending the Spring Garden Gala and want to confirm the dress code. The listing says 'black-tie optional' - what exactly does this mean? Can you provide examples?",
      status: "Resolved",
    },
    {
      customerID: customers[0].customerID,
      subject: "Age Verification for Comedy Show",
      description:
        "I want to bring my 20-year-old friend to the Comedy Roast Extravaganza, but the description mentions it's adults-only. Is there a specific age requirement?",
      status: "Open",
    },
    {
      customerID: customers[6].customerID,
      subject: "Dietary Restrictions for Food Festival",
      description:
        "I have severe nut allergies and am attending the Food & Wine Festival. Can you provide information about allergen-free options and safety protocols?",
      status: "Open",
    },
  ]);

  console.log("✅ Las Vegas events database seeding completed successfully!");
  console.log(`📍 Created ${venues.length} iconic Vegas venues`);
  console.log(`🎭 Created ${events.length} exciting events`);
  console.log(`👥 Created ${customers.length} customers`);
  console.log(`🎫 Created ${bookings.length} bookings`);
  console.log(`💳 Created payment records`);
  console.log(`🎧 Created support tickets`);

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
