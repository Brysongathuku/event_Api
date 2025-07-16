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
import {
  adminRoleAuth,
  bothRoleAuth,
  userRoleAuth,
} from "../middleware/bearAuth";

const ticket = (app: Express) => {
  app.route("/ticket/register").post(userRoleAuth, async (req, res, next) => {
    try {
      await createSupportTicketController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/tickets").get(bothRoleAuth, async (req, res, next) => {
    try {
      await getAllSupportTicketsController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/ticket/:id").get(bothRoleAuth, async (req, res, next) => {
    try {
      await getSupportTicketByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app
    .route("/customer/:customerID/ticket")
    .get(bothRoleAuth, async (req, res, next) => {
      try {
        await getTicketsByCustomerController(req, res);
      } catch (error: any) {
        next(error);
      }
    });

  app
    .route("/ticket/status/:status")
    .get(adminRoleAuth, async (req, res, next) => {
      try {
        await getTicketsByStatusController(req, res);
      } catch (error: any) {
        next(error);
      }
    });

  app.route("/ticket/:id").delete(bothRoleAuth, async (req, res, next) => {
    try {
      await deleteSupportTicketController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/ticket/:id").put(bothRoleAuth, async (req, res, next) => {
    try {
      await updateSupportTicketStatusController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
};

export default ticket;
