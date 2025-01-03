import express from "express";
import { Register } from "../controllers/Register.controller";
import { Login } from "../controllers/Login.controller";
import { validateLogin, validateRegister } from "../utils/validation/auth";
import { CreateRecipe, DeleteRecipe, GetRecipes, UpdateRecipe, GetRecipeById } from "../controllers/Recipes.controller";
import { CreateUser, GetUsers, LogoutUser, RefreshToken } from "../controllers/User.controller";
import { isAuthenticated } from "../middlewares/protected.route";
const router = express.Router();

// auth routes: 
router.post("/auth/login", validateLogin, Login);
router.post("/auth/register", validateRegister, Register);
router.post("/auth/logout", LogoutUser);
router.post('/auth/refreshToken', RefreshToken)
// router.get("/profile", isAuthenticated, ProtectedRouteUser);

// auth admin routes

// recipe routes 
router.get("/recipes", GetRecipes);
router.get("/recipes/:id", GetRecipeById);
router.post("/recipes", CreateRecipe);
router.put("/recipes/:id", UpdateRecipe);
router.delete("/recipes/:id", DeleteRecipe);
export default router 