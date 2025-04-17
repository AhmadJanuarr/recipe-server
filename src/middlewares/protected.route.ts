import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  payload?: {
    userId: number;
    role: string;
  };
}
export const isAuthenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  // mengecek apakah ada token
  if (!authorization) {
    res.status(401).send({
      success: false,
      message: "Un-Authorized Access | anda belum login | anda tidak memiliki token",
    });
    return;
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "secret") as { userId: number; role: string };
    req.payload = payload;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }
};
