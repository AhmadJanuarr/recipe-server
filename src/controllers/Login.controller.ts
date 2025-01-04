import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { FindUserByEmail } from "../services/users.services";
import { GenerateTokens } from "../middlewares/jwt";
import { AddRefreshTokenToWhitelist } from "../services/auth.services";

// controller untuk login
export const Login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Validasi input kosong
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "Email dan kata sandi diperlukan",
        });
        return;
    }

    // Validasi menggunakan express-validator
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
        // Temukan pengguna berdasarkan email
        const user = await FindUserByEmail(email);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "Pengguna tidak ditemukan",
            });
            return;
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Kata sandi salah",
            });
            return;
        }

        // Generate accessToken dan refreshToken
        const { accessToken, refreshToken } = GenerateTokens(user);

        // Tambahkan refreshToken ke whitelist
        await AddRefreshTokenToWhitelist({
            refreshToken,
            userId: user.id,
        });

        // Kirimkan respons sukses
        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
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
