import { UploadImageAvatarToSupabase } from "./../services/supabase.services";
import { UserProps } from "./../types/user.d";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { validationResult } from "express-validator";
import { CustomRequest } from "../types/payload";
import { FindUserById, UpdateUserEmail, UpdateUserName, UpdateUserPassword } from "../services/users.services";
import { Supabase } from "../config/supabase.config";
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

export const UpdateAvatarUser = async (req: CustomRequest, res: Response) => {
  const { userId } = req.payload || {};

  if (!userId) {
    res.status(400).json({ success: false, message: "User tidak ditemukan" });
    return;
  }
  const user = await FindUserById(userId);

  if (user?.avatar) {
    try {
      //1. AMBIL DATA AVATAR DARI STORAGE
      const { data: files, error: listError } = await Supabase.storage.from("avatars").list(`${userId}`);
      if (listError) {
        res.status(400).json({
          success: false,
          message: "Gagal mengambil list avatar lama",
          msg: listError.message,
        });
      }
      //2. TANGKAP PATH LENGKAPNYA
      const pathsToDelete = files?.map((file) => `${userId}/${file.name}`) || [];

      //3. CEK APAKAH PATHNYA TERDAPAT FILE ? HAPUS FILE SEMUANYA : TERJADI ERROR
      if (pathsToDelete.length > 0) {
        const { error: removeError } = await Supabase.storage.from("avatars").remove(pathsToDelete);

        if (removeError) {
          res.status(400).json({ success: false, message: "gagal menghapus avatar" });
          return;
        }
      }

      //4. KOSONGKAN AVATAR DI DALAM DATABASE
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: null },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: "Error saat menghapus avatar lama",
        msg: error.message,
      });
    }
  }

  // UPLOAD FILE BARU KE STORAGE SUPABASE
  const UploadAvatarToStorage = await UploadImageAvatarToSupabase(req.file!, userId);

  try {
    //UPDATE USER KHUSUS BAGIAN AVATAR
    const updateAvatar = await prisma.user.update({
      where: { id: userId },
      data: { avatar: UploadAvatarToStorage || null },
    });
    res.status(200).json({
      success: true,
      message: "Berhasil mengubah avatar dan menghapus avatar sebelumnya",
      data: updateAvatar,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Gagal mengubah avatar sama sekali", msg: error.message });
  }
};

export const DeleteUser = async (req: CustomRequest, res: Response) => {
  const { userId } = req.payload || {};
  if (!userId) {
    res.status(400).json({ success: false, message: "User tidak ditemukan" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      const { data: files, error: ListError } = await Supabase.storage.from("avatars").list(`${userId}`);
      if (ListError) {
        res.status(400).json({
          success: false,
          message: "Gagal mengambil list avatar lama",
          msg: ListError.message,
        });
        return;
      }
      const pathsToDelete = files?.map((file) => `${userId}/${file.name}`) || [];

      if (pathsToDelete.length > 0) {
        const { error: removeError } = await Supabase.storage.from("avatars").remove(pathsToDelete);
        if (removeError) {
          res.status(400).json({
            success: false,
            message: "Gagal menghapus avatar",
            error: removeError.message,
          });
          return;
        }

        await prisma.user.update({
          where: { id: userId },
          data: { avatar: null },
        });

        await prisma.user.delete({
          where: { id: userId },
        });
      }
      res.status(200).json({
        success: true,
        message: "Akun berhasil dihapus",
      });
      return;
    }
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Gagal menghapus user", msg: error.message });
    return;
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
