import { Request, Response } from "express";
import { getAnalyticsService } from "./analyticsService";

export const getAnalyticsController = async (req: Request, res: Response) => {
  try {
    const analytics = await getAnalyticsService();
    if (!analytics) {
      return res.status(404).json({ message: "No analytics data found" });
    }
    return res.status(200).json({
      success: true,
      data: analytics,
      message: "Analytics data retrieved successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
