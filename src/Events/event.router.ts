import { Express } from "express";
import {
  CreateEventController,
  getEventController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from "./event.controller";
import { adminRoleAuth } from "../middleware/bearAuth";

const event = (app: Express) => {
  app.route("/event/register").post(adminRoleAuth, async (req, res, next) => {
    try {
      await CreateEventController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/events").get(async (req, res, next) => {
    try {
      await getEventController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/event/:id").get(async (req, res, next) => {
    try {
      await getEventByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/event/:id").put(adminRoleAuth, async (req, res, next) => {
    try {
      await updateEventController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/event/:id").delete(adminRoleAuth, async (req, res, next) => {
    try {
      await deleteEventController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default event;
