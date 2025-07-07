import { Express } from "Express";

import {
  CreateEventController,
  getEventController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from "./event.controller";
const event = (app: Express) => {
  app.route("/event/register").post(async (req, res, next) => {
    try {
      await CreateEventController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
  //  get all events
  app.route("/events").get(async (req, res, next) => {
    try {
      await getEventController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
  //  get event by id
  app.route("/event/:id").get(async (req, res, next) => {
    try {
      await getEventByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
  //  update event   by  id
  app.route("/event/:id").put(async (req, res, next) => {
    try {
      await getEventByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
  // delete  event by  id
  app.route("/event/:id").delete(async (req, res, next) => {
    try {
      await deleteEventController(req, res);
    } catch (error) {
      next(error);
    }
  });
};
export default event;
