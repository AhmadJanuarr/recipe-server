import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client/prisma";
import { Request, Response } from "express";

export const Register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).send({
            success: false,
            message: "Nama, email, dan kata sandi diperlukan"
        });
        return;
    }

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

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword,
                updatedAt: new Date(),
                createdAt: new Date()
            }
        });
        res.status(201).send({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send({
            success: false,
            message: "Kesalahan Server Internal"
        });
    }
};
