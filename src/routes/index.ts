import express from "express";
import { validateLogin, validateRegister } from "../utils/validation/auth";
import {
  CreateRecipe,
  DeleteRecipe,
  GetRecipes,
  UpdateRecipe,
  GetRecipeByName,
} from "../controllers/recipesController";
import { isAuthenticated } from "../middlewares/protected.route";
import { RefreshAccessToken } from "../controllers/tokenController";
import { authorizeRoles } from "../middlewares/authorize.roles";
import { AddFavorite, DeleteFavorite } from "../controllers/favoriteController";
import { Login, LogoutUser, Register } from "../controllers/auth/authController";
const router = express.Router();

// auth routes:
router.post("/auth/login", validateLogin, Login);
router.post("/auth/register", validateRegister, Register);
router.post("/auth/logout", LogoutUser);
router.post("/auth/refreshToken", RefreshAccessToken);

// Route accessible to Admin only
router.get("/admin/data", isAuthenticated, authorizeRoles(["ADMIN"]), (req, res) => {
  res.json({ message: "Hello Admin!" });
});
// recipe routes
router.get("/recipes", GetRecipes);
router.get("/recipes/:recipeName", GetRecipeByName);
router.post("/recipes", CreateRecipe);
router.put("/recipes/:id", UpdateRecipe);
router.delete("/recipes/:id", DeleteRecipe);

//feature favorite
router.post("/recipes/favorite/:recipeId", isAuthenticated, AddFavorite);
router.delete("/recipes/favorite/:recipeId", isAuthenticated, DeleteFavorite);
export default router;
