import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateUserByEmailAndPassword, FindUserByEmail } from "../../services/users.services";
import { GenerateTokens } from "../../middlewares/jwt";
import { prisma } from "../../utils/prisma";
import { AddRefreshTokenToWhitelist } from "../../services/auth.services";

export const Login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "Email dan kata sandi diperlukan",
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors: errors.array(),
    });
    return;
  }

  try {
    const user = await FindUserByEmail(email);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Kata sandi salah",
      });
      return;
    }
    const { accessToken, refreshToken } = await GenerateTokens(user);
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message || error,
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: "Kesalahan Server Internal",
    });
    return;
  }
};

export const LogoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Anda belum login",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Logout success",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal logout",
      msg: error.message,
    });
  }
};
