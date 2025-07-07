import {
  createSupportTicketController,
  getAllSupportTicketsController,
  getSupportTicketByIdController,
  getTicketsByCustomerController,
  getTicketsByStatusController,
  deleteSupportTicketController,
  updateSupportTicketStatusController,
} from "./support_tickets.controller";
import { Express } from "express";

const ticket = (app: Express) => {
  // register support  Tickets route
  app.route("/ticket/register").post(
    //  adminRoleAuth,
    async (req, res, next) => {
      try {
        await createSupportTicketController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // get all  support  Ticket route
  app.route("/tickets").get(
    // bothRoleAuth,
    async (req, res, next) => {
      try {
        await getAllSupportTicketsController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // get  support  Ticket by  id route
  app.route("/ticket/:id").get(
    // bothRoleAuth,
    async (req, res, next) => {
      try {
        await getSupportTicketByIdController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  //get    Tickets   By   Customer  route
  app.route("/customer/:customerID/ticket").get(
    // bothRoleAuth,
    async (req, res, next) => {
      try {
        await getTicketsByCustomerController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  //get Tickets  By   Status route

  app.route("/ticket/status/:status").get(
    // bothRoleAuth,
    async (req, res, next) => {
      try {
        await getTicketsByStatusController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  //delete  Support   Ticket router
  app.route("/ticket/:id").delete(
    // bothRoleAuth,
    async (req, res, next) => {
      try {
        await deleteSupportTicketController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  //update  Support   Ticket   Status router
  app.route("/ticket/:id").put(
    // bothRoleAuth,
    async (req, res, next) => {
      try {
        await updateSupportTicketStatusController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );
};
export default ticket;
