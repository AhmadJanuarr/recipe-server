import express, { Request, Response } from "express";
import dotenv from "dotenv";
import usersRoute from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", usersRoute)
app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hellow World");
});

app.listen(PORT, () => {
  console.log(`Express server is listening at http://localhost:${PORT} 🚀`,);
}).on("error", (error) => {
  throw new Error(error.message);
});
