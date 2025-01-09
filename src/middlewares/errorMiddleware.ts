import { NextFunction, Request, Response } from "express";
import CustomError from "../helpers/customError";

export const errorMiddleware = (
  err: Error & CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void  => {
  if (err instanceof CustomError) {
    return res.status(err.status).json({
      status: err.status,
      data: null,
      error: err.message,
    });
  }

  if (process.env.NODE_ENV === "dev")
    console.log(`:: DevMode Error Log ::\nError >> ${err}`);

  return res.status(500).json({status: 500, data: null, error: "Internal server error" });
};
