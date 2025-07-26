import { Express } from "express";
import { getAnalyticsController } from "./analyticsController";
import { adminRoleAuth } from "../middleware/bearAuth";

const analytics = (app: Express) => {
  app.route("/analytics").get(adminRoleAuth, async (req, res, next) => {
    try {
      await getAnalyticsController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
};

export default analytics;
