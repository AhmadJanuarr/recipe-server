import { prisma } from "../utils/prisma";
import { Request, Response } from "express";
import { CreateUserByEmailAndPassword } from "../services/users.services";
import { GenerateTokens } from "../middlewares/jwt";
import { AddRefreshTokenToWhitelist } from "../services/auth.services";

export const Register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: "Nama, email, dan password diperlukan",
    });
    return;
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email sudah digunakan, silahkan gunakan email lain",
      });
      return;
    }
    const user = await CreateUserByEmailAndPassword({ name, email, password });
    const { password: _, ...userWithoutPassword } = user;
    const { accessToken, refreshToken } = await GenerateTokens(user);
    await AddRefreshTokenToWhitelist({ refreshToken, userId: user.id });
    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: userWithoutPassword,
      accessToken,
      refreshToken,
    });
    return;
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan Server Internal",
    });
    return;
  }
};
