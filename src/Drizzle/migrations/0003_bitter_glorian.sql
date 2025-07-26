ALTER TABLE "bookings" ADD COLUMN "numberofTickets" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "totalAmount" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "bookingDate" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "bookingStatus" varchar(20) DEFAULT 'Confirmed';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "eventDate" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "startTime" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "endTime" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "ticketPrice" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "availableTickets" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "totalTickets" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "isActive" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "imageUrl" varchar(500);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "paymentStatus" "payment_status" DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "paymentDate" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "paymentMethod" varchar(50);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "transactionId" varchar(100);--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "venue_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "imageUrl" text;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "number_of_tickets";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "total_amount";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "booking_date";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "booking_status";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "event_date";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "end_time";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "ticket_price";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "available_tickets";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "total_tickets";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "payment_status";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "payment_date";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "payment_method";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "transaction_id";--> statement-breakpoint
ALTER TABLE "venues" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "venues" DROP COLUMN "contact_number";