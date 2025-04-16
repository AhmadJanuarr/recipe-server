import { Request } from "express";

export interface CustomRequest extends Request {
  payload?: {
    userId: number;
  };
}
