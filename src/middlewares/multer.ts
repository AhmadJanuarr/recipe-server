import multer from "multer";
import { Request, Response } from "express";

export const fileStorage = multer.memoryStorage();

export const fileFilter = (req: Request, file: any, callback: any) => {
  if (["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(new Error("Only .png, .jpg, .jpeg and .webp format allowed!"));
  }
};
