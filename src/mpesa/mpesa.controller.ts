import { Request, Response, RequestHandler } from "express";
import { initiateStkPush, handleMpesaCallback } from "./mpesa.service";

// STK Push Controller
export const stkPushController: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phoneNumber, amount, paymentID } = req.body;

    if (!phoneNumber || !amount || !paymentID) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    const data = await initiateStkPush({
      phoneNumber,
      amount: Number(amount),
      paymentID: Number(paymentID),
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("STK Push Error:", (error as Error).message);
    res.status(500).json({ success: false, message: "STK push failed" });
  }
};

export const mpesaCallbackController: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paymentIDParam = req.query.payment_id;
    const paymentID = Number(paymentIDParam);

    if (isNaN(paymentID)) {
      res.status(400).json({ message: "Invalid or missing payment_id" });
      return;
    }

    await handleMpesaCallback(paymentID, req.body);

    res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback Error:", (error as Error).message);
    res.status(500).json({ message: "Failed to handle callback" });
  }
};
