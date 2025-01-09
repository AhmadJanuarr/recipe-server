import { prisma } from '../../prisma/client/prisma';
import { Request, Response } from "express";
import { CreateUserByEmailAndPassword } from "../services/users.services";
import { GenerateTokens } from "../middlewares/jwt";
import { AddRefreshTokenToWhitelist } from "../services/auth.services";

// controller untuk membuat user baru
export const Register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).send({
            success: false,
            message: "Nama, email, dan kata sandi diperlukan"
        });
        return;
    }

    // 
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });
        if (existingUser) {
            res.status(400).send({
                success: false,
                message: "Email sudah digunakan"
            });
            return;
        }

        const user = await CreateUserByEmailAndPassword({name , email, password});
        const  {accessToken, refreshToken} = await GenerateTokens(user);
        await AddRefreshTokenToWhitelist({refreshToken, userId: user.id});
        res.status(201).send({
            success: true,
            message: "User created successfully",   
            data: user,
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send({
            success: false,
            message: "Kesalahan Server Internal"
        });
    }
};
