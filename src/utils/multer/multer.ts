import multer from "multer";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const fileStorage = multer.diskStorage({
  destination: function (req: Request, file: any, callback: any) {
    callback(null, "./public/images");
  },
  filename: function (req: Request, file: any, callback: any) {
    callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const fileFilter = (req: Request, file: any, callback: any) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(new Error("Only .png, .jpg, .jpeg and .webp format allowed!"));
  }
};
