import express from "express";
import customer from "./auth/auth.router";
import payment from "./payments/payment.router";
import booking from "./bookings/booking.router";
import cors from "cors";
import venue from "./venue/venue.routers";
import event from "./Events/event.router";
import ticket from "./support_tickets/support_tickets.router";
import analytics from "./Analytics/analyticsRoutes";
import mpesaRoutes from "./mpesa/mpesa.router";
import dotenv from "dotenv/config";
const app = express();
//MIDDLEWARE
app.use(cors());
app.use(express.json());
//ROUTES

customer(app);
payment(app);
booking(app);
venue(app);
event(app);
ticket(app);
analytics(app);
app.use("/api/mpesa", mpesaRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
