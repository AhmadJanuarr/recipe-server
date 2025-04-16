import express from "express";
import { Login, LogoutUser, Register } from "../controllers/auth/authController";
import { ToggleFavorite } from "../controllers/favoriteController";
import {
  CreateRecipe,
  DeleteRecipe,
  GetRecipeByName,
  GetRecipes,
  UpdateRecipe,
} from "../controllers/recipesController";
import { RefreshAccessToken } from "../controllers/tokenController";
import { authorizeRoles } from "../middlewares/authorize.roles";
import { isAuthenticated } from "../middlewares/protected.route";
import { validateLogin, validateRegister } from "../utils/validation/auth";
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
router.post("/recipes/favorite/:recipeId/toggle", isAuthenticated, ToggleFavorite);

export default router;
