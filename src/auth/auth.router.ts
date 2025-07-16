import { Express } from "express";
import {
  registerCustomerController,
  getCustomerByIdController,
  getCustomerController,
  updateCustomerController,
  loginCustomerController,
  deleteCustomerController,
  verifyCustomerController,
} from "./auth.controller";


import {
  adminRoleAuth,
 
  bothRoleAuth,
} from "../middleware/bearAuth";

const customer = (app: Express) => {

  app.route("/auth/register").post(async (req, res, next) => {
    try {
      await registerCustomerController(req, res);
    } catch (error) {
      next(error);
    }
  });

 
  app.route("/auth/login").post(async (req, res, next) => {
    try {
      await loginCustomerController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/auth/verify").post(async (req, res, next) => {
    try {
      await verifyCustomerController(req, res);
    } catch (error) {
      next(error);
    }
  });


  app.route("/customers").get(adminRoleAuth, async (req, res, next) => {
    try {
      await getCustomerController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

 
  app.route("/customer/:id").get(bothRoleAuth, async (req, res, next) => {
    try {
      await getCustomerByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/customer/:id").put(bothRoleAuth, async (req, res, next) => {
    try {
      await updateCustomerController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

 
  app.route("/customer/:id").delete(adminRoleAuth, async (req, res, next) => {
    try {
      await deleteCustomerController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
};

export default customer;
