import express from "express";
import { Signup } from "../controllers/Signup.controller";
import { Login } from "../controllers/Login.controller";
import { validateLogin, validateSignup } from "../utils/validation/auth";
import { CreateRecipe, DeleteRecipe, GetRecipes, UpdateRecipe, GetRecipeById } from "../controllers/Recipes.controller";
const router = express.Router();

router.get("/admin/users",);
router.post("/login", validateLogin, Login);
router.post("/signup", validateSignup, Signup);
router.get("/recipes", GetRecipes);
router.get("/recipes/:id", GetRecipeById);
router.post("/recipes", CreateRecipe);
router.put("/recipes/:id", UpdateRecipe);
router.delete("/recipes/:id", DeleteRecipe);
export default router