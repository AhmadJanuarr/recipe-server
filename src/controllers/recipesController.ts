import { Response, Request } from "express";
import { UploadImageToSupabase } from "../services/supabase.services";
import { prisma } from "../utils/prisma";
import { CustomRequest } from "../types/payload";

export const GetRecipes = async (req: CustomRequest, res: Response) => {
  const { userId } = req.payload || {};
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        favorite: {
          where: {
            userId,
          },
        },
        ingredients: true,
        steps: true,
      },
    });

    const RecipeWithNewFeature = recipes.map((recipe) => ({ ...recipe, isFavorite: recipe.favorite.length > 0 }));

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil resep",
      data: RecipeWithNewFeature,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil resep",
      data: error.message,
    });
  }
};

export const CreateRecipe = async (req: Request, res: Response) => {
  const { title, description, category, calories, protein, fat, carbs, tips, difficulty } = req.body;
  if (!req.file) {
    res.status(422).json({
      success: false,
      message: "Gambar resep harus diisi",
    });
    return;
  }
  let ingredients: string[] = [];
  let steps: string[] = [];
  let imageUrl: string;

  try {
    imageUrl = await UploadImageToSupabase(req.file);
    ingredients = JSON.parse(req.body.ingredients);
    steps = JSON.parse(req.body.steps);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Ingredients dan steps harus berupa array valid.",
      data: error.message,
    });
    return;
  }
  const nutritionData = {
    calories: parseInt(calories),
    protein: parseFloat(protein),
    fat: parseFloat(fat),
    carbs: parseFloat(carbs),
  };

  if (
    isNaN(nutritionData.calories) ||
    isNaN(nutritionData.protein) ||
    isNaN(nutritionData.fat) ||
    isNaN(nutritionData.carbs)
  ) {
    res.status(422).json({
      success: false,
      message: "Nutrisi harus berupa angka",
    });
    return;
  }

  if (!title || !description || !ingredients || !steps || !category || !nutritionData) {
    res.status(400).json({
      success: false,
      message: "Semua field harus diisi yah",
    });
    return;
  }

  try {
    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        image: imageUrl,
        category,
        tips,
        difficulty,
        nutrition: {
          create: nutritionData,
        },
        ingredients: { create: ingredients.map((ingredient: string) => ({ name: ingredient })) },
        steps: { create: steps.map((step: string) => ({ description: step })) },
      },
      include: {
        ingredients: true,
        steps: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Resep berhasil dibuat",
      data: newRecipe,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat resep",
      data: error.message,
    });
    return;
  }
};

export const UpdateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category, ingredients, steps, calories, protein, fat, carbs } = req.body;

  try {
    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = await UploadImageToSupabase(req.file);
      res.status(422).json({
        success: false,
        message: "Gambar resep harus diisi",
      });
      return;
    }
    const nutritionData = {
      calories: parseInt(calories),
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbs: parseFloat(carbs),
    };

    if (Object.values(nutritionData).some(isNaN)) {
      res.status(422).json({
        success: false,
        message: "Nutrisi harus berupa angka",
      });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        category,
        image: imageUrl,
        nutrition: {
          update: nutritionData,
        },
        ingredients: {
          deleteMany: {},
          create: JSON.parse(ingredients).map((ingredient: string) => ({ name: ingredient })),
        },
        steps: {
          deleteMany: {},
          create: JSON.parse(steps).map((step: string) => ({ description: step })),
        },
      },
    });
    res.status(201).json({
      success: true,
      message: "Resep berhasil diperbarui",
      data: updatedRecipe,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui resep",
      data: error.message,
    });
    return;
  }
};

export const DeleteRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.recipe.delete({
      where: { id: Number(id) },
    });
    res.status(204).json({
      success: true,
      message: "Resep berhasil dihapus",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus resep",
      msg: error.message,
    });
  }
};

export const GetRecipeByName = async (req: Request, res: Response) => {
  const { recipeName } = req.params;
  try {
    const byName = await prisma.recipe.findFirst({
      where: {
        title: {
          equals: recipeName,
        },
      },
      include: {
        ingredients: true,
        steps: true,
        nutrition: true,
      },
    });
    if (!byName) {
      res.status(404).json({
        success: false,
        message: "Resep tidak ditemukan",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Resep berhasil ditemukan",
      data: byName,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal ditemukan karena server error",
      msg: error.message,
    });
  }
};
