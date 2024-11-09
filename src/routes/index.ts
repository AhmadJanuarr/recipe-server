import express from "express";
import { Signup } from "../controllers/Signup.controller";
import { Login } from "../controllers/Login.controller";
import { validateLogin, validateSignup } from "../utils/validation/auth";
const router = express.Router();

router.get("/admin/users",);
router.post("/login", validateLogin, Login);
router.post("/signup", validateSignup, Signup);
router.get("/recipes",)
export default router