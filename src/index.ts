import { fileFilter, fileStorage } from "./middlewares/multer";
import express from "express";
import dotenv from "dotenv";
import usersRoute from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

// Middleware CORS & Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Routes
app.use("/api", usersRoute);
app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.on("error", (error) => console.error("Server error", error));
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Found 🤷‍♂️",
  });
});

export default app;
