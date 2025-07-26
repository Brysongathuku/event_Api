import db from "../Drizzle/db";
import { count, sum, sql, eq, and, gte, desc } from "drizzle-orm";
import {
  CustomersTable,
  EventsTable,
  BookingsTable,
  PaymentsTable,
  VenuesTable,
} from "../Drizzle/schema";

export const getAnalyticsService = async () => {
  try {
    // Get total events
    const totalEventsResult = await db
      .select({ count: count() })
      .from(EventsTable)
      .where(eq(EventsTable.isActive, true));

    // Get total bookings
    const totalBookingsResult = await db
      .select({ count: count() })
      .from(BookingsTable);

    // Get total revenue from confirmed bookings
    const totalRevenueResult = await db
      .select({ revenue: sum(BookingsTable.totalAmount) })
      .from(BookingsTable)
      .where(eq(BookingsTable.bookingStatus, "Confirmed"));

    // Get total customers
    const totalCustomersResult = await db
      .select({ count: count() })
      .from(CustomersTable);

    // Get tickets sold per event
    const ticketsPerEventResult = await db
      .select({
        eventID: EventsTable.eventID,
        eventName: EventsTable.title,
        venueName: VenuesTable.venueName,
        ticketsSold: sql<number>`COALESCE(SUM(${BookingsTable.numberOfTickets}), 0)`,
      })
      .from(EventsTable)
      .leftJoin(VenuesTable, eq(EventsTable.venueID, VenuesTable.venueID))
      .leftJoin(
        BookingsTable,
        and(
          eq(EventsTable.eventID, BookingsTable.eventID),
          eq(BookingsTable.bookingStatus, "Confirmed")
        )
      )
      .where(eq(EventsTable.isActive, true))
      .groupBy(EventsTable.eventID, EventsTable.title, VenuesTable.venueName)
      .orderBy(desc(sql`COALESCE(SUM(${BookingsTable.numberOfTickets}), 0)`))
      .limit(10);

    // Get revenue distribution per event
    const revenueDistributionResult = await db
      .select({
        eventName: EventsTable.title,
        revenue: sql<number>`COALESCE(SUM(${BookingsTable.totalAmount}), 0)`,
      })
      .from(EventsTable)
      .leftJoin(
        BookingsTable,
        and(
          eq(EventsTable.eventID, BookingsTable.eventID),
          eq(BookingsTable.bookingStatus, "Confirmed")
        )
      )
      .where(eq(EventsTable.isActive, true))
      .groupBy(EventsTable.eventID, EventsTable.title)
      .having(sql`SUM(${BookingsTable.totalAmount}) > 0`)
      .orderBy(desc(sql`SUM(${BookingsTable.totalAmount})`))
      .limit(8);

    // Get bookings over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingsOverTimeResult = await db
      .select({
        date: sql<string>`DATE(${BookingsTable.bookingDate})`,
        bookings: count(),
        revenue: sql<number>`COALESCE(SUM(${BookingsTable.totalAmount}), 0)`,
      })
      .from(BookingsTable)
      .where(
        and(
          gte(BookingsTable.bookingDate, thirtyDaysAgo.toISOString()),
          eq(BookingsTable.bookingStatus, "Confirmed")
        )
      )
      .groupBy(sql`DATE(${BookingsTable.bookingDate})`)
      .orderBy(sql`DATE(${BookingsTable.bookingDate})`);

    // Get payment status breakdown
    const paymentStatusResult = await db
      .select({
        status: PaymentsTable.paymentStatus,
        count: count(),
        amount: sql<number>`COALESCE(SUM(${PaymentsTable.amount}), 0)`,
      })
      .from(PaymentsTable)
      .groupBy(PaymentsTable.paymentStatus)
      .orderBy(desc(count()));

    // Get top customers
    const topCustomersResult = await db
      .select({
        customerName: sql<string>`${CustomersTable.firstName} || ' ' || ${CustomersTable.lastName}`,
        totalBookings: count(),
        totalSpent: sql<number>`COALESCE(SUM(${BookingsTable.totalAmount}), 0)`,
      })
      .from(CustomersTable)
      .leftJoin(
        BookingsTable,
        eq(CustomersTable.customerID, BookingsTable.customerID)
      )
      .where(eq(BookingsTable.bookingStatus, "Confirmed"))
      .groupBy(
        CustomersTable.customerID,
        CustomersTable.firstName,
        CustomersTable.lastName
      )
      .orderBy(desc(sql`SUM(${BookingsTable.totalAmount})`))
      .limit(10);

    // Calculate revenue percentages
    const totalRevenue = Number(totalRevenueResult[0]?.revenue || 0);
    const revenueDistribution = revenueDistributionResult.map((row) => ({
      eventName: row.eventName,
      revenue: Number(row.revenue),
      percentage:
        totalRevenue > 0 ? (Number(row.revenue) / totalRevenue) * 100 : 0,
    }));

    const analytics = {
      kpis: {
        totalEvents: totalEventsResult[0]?.count || 0,
        totalBookings: totalBookingsResult[0]?.count || 0,
        totalRevenue: totalRevenue,
        totalCustomers: totalCustomersResult[0]?.count || 0,
      },
      ticketsPerEvent: ticketsPerEventResult.map((row) => ({
        eventName: row.eventName,
        eventID: row.eventID,
        ticketsSold: Number(row.ticketsSold),
        venue: row.venueName || "Unknown Venue",
      })),
      revenueDistribution,
      bookingsOverTime: bookingsOverTimeResult.map((row) => ({
        date: row.date,
        bookings: row.bookings,
        revenue: Number(row.revenue),
      })),
      paymentStatusBreakdown: paymentStatusResult.map((row) => ({
        status: row.status || "Unknown",
        count: row.count,
        amount: Number(row.amount),
      })),
      topCustomers: topCustomersResult.map((row) => ({
        customerName: row.customerName,
        totalBookings: row.totalBookings,
        totalSpent: Number(row.totalSpent),
      })),
    };

    return analytics;
  } catch (error) {
    console.error("Analytics service error:", error);
    throw error;
  }
};
