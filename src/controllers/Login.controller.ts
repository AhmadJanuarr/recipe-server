import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client/prisma";
import { validationResult } from "express-validator";
export const Login = async (req: Request, res: Response,): Promise<void> => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        res.status(400).send({
            success: false,
            message: "Email dan kata sandi diperlukan"
        });
        return
    }

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.status(400).send({
            success: false,
            message: "Email dan kata sandi tidak boleh kosong"
        });
        return;
    }
    try {
        const user = await prisma.user.findFirst({
            where: { email: email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        });
        if (!user) {
            res.status(400).send({
                success: false,
                message: "Pengguna tidak ditemukan"
            })
            return
        }
        const isPasswordValid = await bcrypt.compare(password, user!.password)
        if (!isPasswordValid) {
            res.status(400).send({
                success: false,
                message: "Password salah"
            })
            return
        }
        const token = jwt.sign({ userId: user!.id }, process.env.JWT_SECRET! as string, {
            expiresIn: "1h"
        });
        res.json({
            success: true,
            statusCode: 200,
            message: "Login Berhasil",
            data: {
                id: user!.id,
                name: user!.name,
                email: user!.email,
            },
            token: token
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Email atau kata sandi salah"
        });
        return
    }
}