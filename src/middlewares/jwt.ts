import jwt from "jsonwebtoken";
import crypto from "crypto";

export const GenerateAccessToken = (user :any ) => {
if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
}
return jwt.sign({userId: user.id}, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m"
    });
}

export const GenerateRefreshToken = () =>{
    const token = crypto.randomBytes(16).toString('base64url');
    return token
}

export const GenerateTokens =   (user : any) =>{
    const accessToken = GenerateAccessToken(user);
    const refreshToken = GenerateRefreshToken();
    return{ accessToken, refreshToken }
}