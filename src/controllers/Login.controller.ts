import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { FindUserByEmail } from "../services/users.services";
import { GenerateTokens } from "../middlewares/jwt";

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
