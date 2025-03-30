import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
interface CustomRequest extends Request {
  payload?: {
    userId: number;
  };
}
export const AddFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.payload || {};

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User tidak ditemukan atau belum login",
      });
      return;
    }

    const parsedRecipeId = parseInt(recipeId, 10);
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        recipeId: parsedRecipeId,
      },
    });

    if (existingFavorite) {
      res.status(400).json({
        success: false,
        message: "Favorite sudah ada ",
      });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        recipeId: parsedRecipeId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Favorite berhasil ditambahkan",
      data: favorite,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan favorite",
      msg: error.message,
    });
  }
};

export const DeleteFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.payload || {};
    await prisma.favorite.deleteMany({
      where: {
        userId,
        recipeId: parseInt(recipeId, 10),
      },
    });
    res.status(204).json({
      success: true,
      message: "Favorite berhasil dihapus",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus favorite",
      msg: error.message,
    });
  }
};
