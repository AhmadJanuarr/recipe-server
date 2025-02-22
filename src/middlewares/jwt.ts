import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

type UserProps = {
  id: number;
  role: string;
};
export const GenerateAccessToken = (user: UserProps) => {
  const secretAccess = process.env.JWT_ACCESS_SECRET;
  const expireIn = 60 * 60 * 1;
  if (!secretAccess) {
    throw new Error("Secret Access is not defined");
  }
  return jwt.sign({ userId: user.id, role: user.role }, secretAccess, {
    expiresIn: expireIn,
  });
};

export const GenerateRefreshToken = async (user: UserProps) => {
  const secretRefresh = process.env.JWT_REFRESH_SECRET;
  if (!secretRefresh) {
    throw new Error("Secret Refresh is not defined");
  }
  const refreshToken = jwt.sign({ userId: user.id }, secretRefresh, { expiresIn: "7d" });

  await prisma.refreshToken.create({
    data: {
      hashToken: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });
  return refreshToken;
};

export const GenerateTokens = async (user: any) => {
  const accessToken = GenerateAccessToken(user);
  const refreshToken = await GenerateRefreshToken(user);
  return { accessToken, refreshToken };
};
