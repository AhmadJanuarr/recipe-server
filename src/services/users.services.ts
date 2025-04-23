import { UserProps } from "../types/user";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";

export const FindUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const FindUserById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const CreateUserByEmailAndPassword = (user: UserProps) => {
  if (user.password) {
    user.password = bcrypt.hashSync(user.password, 10);
  } else {
    throw new Error("Password is required");
  }
  return prisma.user.create({
    data: {
      ...user,
      password: user.password as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

export const UpdateUserName = (userId: number, name: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });
};

export const UpdateUserEmail = async (userId: number, email: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: email,
    },
  });
};

export const UpdateUserPassword = async (userId: number, password: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { password },
  });
};
