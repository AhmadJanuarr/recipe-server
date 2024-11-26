import express from "express";
import { Register } from "../controllers/Register.controller";
import { Login } from "../controllers/Login.controller";
import { validateLogin, validateRegister } from "../utils/validation/auth";
import { CreateRecipe, DeleteRecipe, GetRecipes, UpdateRecipe, GetRecipeById } from "../controllers/Recipes.controller";
import { LogoutUser } from "../controllers/User.controller";
const router = express.Router();

// auth routes: 
router.post("/auth/login", validateLogin, Login);
router.post("/auth/register", validateRegister, Register);
router.post("/auth/logout", LogoutUser);

// auth admin routes
router.get("/admin/users",);

// recipe routes 
router.get("/recipes", GetRecipes);
router.get("/recipes/:id", GetRecipeById);
router.post("/recipes", CreateRecipe);
router.put("/recipes/:id", UpdateRecipe);
router.delete("/recipes/:id", DeleteRecipe);
export default router 