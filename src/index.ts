import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { fileFilter, fileStorage } from "./middlewares/multer";
import usersRoute from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

// routes
app.use("/api", usersRoute);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API 🚀",
  });
});
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found 🤷‍♂️",
  });
});

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
