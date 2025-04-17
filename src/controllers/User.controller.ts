import { UserProps } from "./../types/user.d";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { validationResult } from "express-validator";
import { CustomRequest } from "../types/payload";
import { UpdateUserEmail, UpdateUserName, UpdateUserPassword } from "../services/users.services";
import bcrypt from "bcrypt";

export const UpdateName = async (req: CustomRequest, res: Response) => {
  const { name } = req.body;
  const { userId } = req.payload || {};

  if (!name) {
    res.status(400).json({
      success: false,
      message: "Nama harus diisi",
    });
    return;
  }
  try {
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan",
      });
      return;
    }
    const updateName = UpdateUserName(userId, name);
    res.status(200).json({
      success: true,
      message: "Berhasil mengubah nama",
      data: updateName,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Gagal mengubah nama", msg: error.message });
  }
};

export const UpdateEmail = async (req: CustomRequest, res: Response) => {
  const { email } = req.body;
  const { userId } = req.payload || {};

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email harus diisi",
    });
    return;
  }

  try {
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan",
      });
      return;
    }
    const UpdateEmail = UpdateUserEmail(userId, email);
    res.status(200).json({
      success: true,
      message: "Berhasil mengubah email",
      data: UpdateEmail,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Gagal mengubah email", msg: error.message });
  }
};

export const UpdatePassword = async (req: CustomRequest, res: Response) => {
  const { userId } = req.payload || {};
  const { newPassword, currentPassword } = req.body;

  if (!userId) {
    res.status(400).json({ success: false, message: "User tidak ditemukan" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });

  try {
    const isMatch = await bcrypt.compare(currentPassword, user!.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Password tidak sama dengan password sebelumnya" });
      return;
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const UpdatePassword = UpdateUserPassword(userId, hashPassword);
    res.status(200).json({
      success: true,
      message: "Berhasil mengubah password",
      data: UpdatePassword,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Gagal mengubah password", msg: error.message });
  }
};

export const GetUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil user",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil user",
      msg: error.message,
    });
  }
};

export const CreateUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validations errors",
      errors: errors.array(),
    });
  }
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user: UserProps = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        updatedAt: new Date(),
      },
    });
    res.status(201).json({
      success: true,
      message: "Berhasil membuat user",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat user",
      msg: error.message,
    });
  }
};

// export const ProtectedRouteUser = async (req: Request, res: Response): Promise<void> => {
//     console.log(req.payload)
//     try {
//         const { userId } = (req as any).payload;
//         const user = await FindUserById(userId);

//       if (user) {
//         const { password, ...userWithoutPassword } = user;
//         res.status(200).json({
//           success: true,
//           message: "Berhasil mengambil user",
//           data: userWithoutPassword,
//         });
//       } else {
//         res.status(404).json({
//           success: false,
//           message: "User tidak ditemukan",
//         });
//       }
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         message: "Gagal mengambil user",
//         error: error.message,
//       });
//     }
//   };
