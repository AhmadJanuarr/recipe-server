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

export const GetAllFavorite = async (req: CustomRequest, res: Response) => {
  const { userId } = req.payload || {};
  const { userName } = req.params;

  console.log(userId, userName);

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: User tidak ditemukan atau belum login",
    });
    return;
  }

  const userNameReplace = userName.replace("-", " ");
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      name: userNameReplace,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User tidak ditemukan",
    });
    return;
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        favorite: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        favorite: true,
      },
    });
    const RecipeWithNewFeature = recipes.map((recipe) => ({ ...recipe, isFavorite: recipe.favorite?.length > 0 }));

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua resep favorite",
      data: RecipeWithNewFeature,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil resep favorite",
      data: error.message,
    });
  }
};
