import { Express } from "express";
import {
  getVenueController,
  registervenueController,
  updateVenueController,
  deleteVenueController,
  getVenueByIdController,
  getVenueWithEventsController,
} from "./venue.controller";
import {
  adminRoleAuth,
  bothRoleAuth,
  userRoleAuth,
} from "../middleware/bearAuth";

const venue = (app: Express) => {
  // register venue route
  app.route("/venue/register").post(adminRoleAuth, async (req, res, next) => {
    try {
      await registervenueController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  // get all venues route
  app.route("/venues").get(bothRoleAuth, async (req, res, next) => {
    try {
      await getVenueController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  // get venue by id route
  app.route("/venue/:id").get(adminRoleAuth, async (req, res, next) => {
    try {
      await getVenueByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  // get venue with available event route
  app.route("/venues-event/:id").get(bothRoleAuth, async (req, res, next) => {
    try {
      await getVenueWithEventsController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  // update venue by id route
  app.route("/venue/:id").put(adminRoleAuth, async (req, res, next) => {
    try {
      await updateVenueController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  // delete venue by id route
  app.route("/venue/:id").delete(adminRoleAuth, async (req, res, next) => {
    try {
      await deleteVenueController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
};

export default venue;
