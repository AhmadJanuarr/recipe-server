import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    jwt.verify(authHeader, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "invalid token"
            })
        }
        next();
    })
}