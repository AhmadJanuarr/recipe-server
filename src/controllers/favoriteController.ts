import { Response } from "express";
import { prisma } from "../utils/prisma";
import { CustomRequest } from "../types/payload";

export const ToggleFavorite = async (req: CustomRequest, res: Response) => {
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
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    res.status(201).json({
      success: false,
      message: "Resep di hapus dari favorite",
      isFavorite: false,
    });
    return;
  }

  await prisma.favorite.create({
    data: {
      userId,
      recipeId: parsedRecipeId,
    },
  });

  res.status(201).json({
    success: true,
    message: "Resep berhasil ditambahkan ke favorite",
    isFavorite: true,
  });
};
