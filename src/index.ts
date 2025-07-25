import express from "express";
import customer from "./auth/auth.router";
import payment from "./payments/payment.router";
import booking from "./bookings/booking.router";
import cors from "cors";
import venue from "./venue/venue.routers";
import event from "./Events/event.router";
import ticket from "./support_tickets/support_tickets.router";
import analytics from "./Analytics/analyticsRoutes";
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

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
export default app;
