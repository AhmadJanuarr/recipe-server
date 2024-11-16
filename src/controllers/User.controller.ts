import { Request, Response } from "express";
import { prisma } from "../../prisma/client/prisma";

export const LogoutUser = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies.refreshToken;
        if (!cookie) {
            res.status(400).json({
                success: false,
                message: "Anda belum login"
            });
        }
        res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: "Logout success"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Gagal logout",
            msg: error.message
        });
    }
}