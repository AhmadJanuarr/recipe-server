import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { validationResult } from "express-validator";
import { User } from "../types/user";

// controller untuk logout user
export const LogoutUser = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies.refreshToken;
    if (!cookie) {
      res.status(400).json({
        success: false,
        message: "Anda belum login",
      });
    }
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "Logout success",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal logout",
      msg: error.message,
    });
  }
};

// controller untuk mengambil user
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

// controller untuk membuat user

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
    const user: User = await prisma.user.create({
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
