import express from "express";
import { Register } from "../controllers/Register.controller";
import { Login } from "../controllers/Login.controller";
import { validateLogin, validateRegister } from "../utils/validation/auth";
import {
  CreateRecipe,
  DeleteRecipe,
  GetRecipes,
  UpdateRecipe,
  GetRecipeByName,
} from "../controllers/Recipes.controller";
import { LogoutUser } from "../controllers/User.controller";
import { isAuthenticated } from "../middlewares/protected.route";
import { RefreshAccessToken } from "../controllers/Token.controller";
import { authorizeRoles } from "../middlewares/authorize.roles";
const router = express.Router();

// auth routes:
router.post("/auth/login", validateLogin, Login);
router.post("/auth/register", validateRegister, Register);
router.post("/auth/logout", LogoutUser);
router.post("/auth/refreshToken", RefreshAccessToken);
// router.get("/profile", isAuthenticated, ProtectedRouteUser);

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
export default router;
