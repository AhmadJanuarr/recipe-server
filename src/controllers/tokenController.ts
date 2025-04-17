import { Request, Response } from "express";
import { FindRefreshToken, RevokeTokens } from "../services/auth.services";
import { FindUserById } from "../services/users.services";
import { GenerateTokens } from "../middlewares/jwt";
import { AddRefreshTokenToWhitelist, DeleteRefreshTokenById } from "../services/auth.services";

export const RefreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({
      success: false,
      message: "Token tidak ditemukan",
    });
    return;
  }
  try {
    const SavedRefreshToken = await FindRefreshToken(refreshToken);
    if (
      !SavedRefreshToken ||
      SavedRefreshToken.revoked === true ||
      Date.now() >= SavedRefreshToken.expiresAt.getTime()
    ) {
      res.status(404).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const user = await FindUserById(SavedRefreshToken!.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await DeleteRefreshTokenById(SavedRefreshToken!.id);
    const { accessToken, refreshToken: newRefreshToken } = await GenerateTokens(user);
    await AddRefreshTokenToWhitelist({ refreshToken: newRefreshToken, userId: user!.id });

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal refresh token",
      msg: error.message,
    });
  }
};

export const RevokeRefreshTokens = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await RevokeTokens(userId);
    res.status(200).json({
      status: true,
      message: "Tokens revoked",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal revoke token",
      msg: error.message,
    });
  }
};
