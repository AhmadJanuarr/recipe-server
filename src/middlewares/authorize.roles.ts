import { NextFunction, Request, Response } from "express";
export const authorizeRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).payload;
        if (!user || !roles.includes(user.role)) {
             res.status(403).json({
                success: false,
                message: "Forbidden: You do not have the required role",
            });
            return
        }else {
            next();
        }
    }
}
