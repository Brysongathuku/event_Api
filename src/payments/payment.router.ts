import { Express } from "express";
import {
  registerPaymentController,
  getPaymentController,
  getPaymentByIdController,
  updatePaymentController,
  getPaymentsByCustomerController,
  deletePaymentController,
} from "./payment.controller";
import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

const payment = (app: Express) => {
  app.route("/payment/register").post(userRoleAuth, async (req, res, next) => {
    try {
      await registerPaymentController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/payments").get(adminRoleAuth, async (req, res, next) => {
    try {
      await getPaymentController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/payment/:id").get(adminRoleAuth, async (req, res, next) => {
    try {
      await getPaymentByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/payment/:id").put(bothRoleAuth, async (req, res, next) => {
    try {
      await updatePaymentController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/payment/:id").delete(adminRoleAuth, async (req, res, next) => {
    try {
      await deletePaymentController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/payment/customer/:customerId").get(userRoleAuth, async (req, res, next) => {
    try {
      await getPaymentsByCustomerController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
};

export default payment;
