import { prisma } from "../../prisma/client/prisma";
import bcrypt from "bcrypt";

type UserProps = {
  name: string;
  email: string;
  password: string;
};

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
  user.password = bcrypt.hashSync(user.password, 10);
  return prisma.user.create({
    data: {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
