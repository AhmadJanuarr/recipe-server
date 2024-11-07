import { body } from "express-validator"
import { prisma } from "../../../prisma/client/prisma";

export const validateSignup = [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("email").notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Email tidak valid").custom(async (value: string) => {
        if (!value) {
            throw new Error("Masukan email");
        }
        const user = await prisma.user.findUnique({
            where: {
                email: value,
            },
        });
        if (user) {
            throw new Error("Email telah digunakan");
        }
        return true;
    }),
    body("password")
        .notEmpty()
        .withMessage("Kata sandi tidak boleh kosong")
        .isLength({ min: 6 })
        .withMessage("Kata sandi harus minimal 6 karakter")
];

export const validateLogin = [
    body("email").isEmail().withMessage("Email tidak valid").custom(async (value: string) => {
        if (!value) {
            throw new Error("Masukan email dengan benar");
        }
        const user = await prisma.user.findUnique({
            where: {
                email: value,
            },
        });
        if (!user) {
            throw new Error("Email tidak terdaftar");
        }
        return true;
    }),
    body("password").notEmpty().withMessage("Kata sandi tidak boleh kosong"),
]