import { prisma } from "../../prisma/client/prisma";
import { NextFunction, Request, Response } from "express";

export const GetRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                ingredients: true,
                steps: true
            }
        });
        res.status(200).json({
            success: true,
            message: "Berhasil mengambil resep",
            data: recipes
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil resep",
            data: error.message
        });
    }
}
export const CreateRecipe = async (req: Request, res: Response) => {
    const { title, description, category } = req.body;
    const image = req.file?.filename;
    console.log(req.body)
    console.log(req.file)
    let ingredients : string [] = []
    let steps : string [] = []

    try{
        ingredients = JSON.parse(req.body.ingredients)
        steps = JSON.parse(req.body.steps)
    }catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Ingredients dan steps harus berupa array valid.",
            data: error.message
        });
        return;
    }
    
    if (!req.file) {
        res.status(422).json({
            success: false,
            message: "Gambar resep harus diisi"
        })
        return
    }
    if (!title || !description || !ingredients || !steps || !category) {
        res.status(400).json({
            success: false,
            message: "Semua field harus diisi"
        })
        return
    }   



    try {
        const newRecipe = await prisma.recipe.create({
            data: {
                title,
                description,
                image,
                category,
                ingredients: { create: ingredients.map((ingredient: string) => ({ name: ingredient })) },
                steps: { create: steps.map((step: string) => ({ name: step })) },
            },
            include: {
                ingredients: true,
                steps: true
            }
        });

        res.status(201).json({
            success: true,
            message: "Resep berhasil dibuat",
            data: newRecipe
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat resep",
            data: error.message
        })
    }
}

export const UpdateRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, ingredients, steps } = req.body;
    const image = req.file?.filename;

    try {
        const updatedRecipe = await prisma.recipe.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                ingredients,
                steps,
                image,
            }
        });
        res.status(201).json({
            success: true,
            message: "Resep berhasil diperbarui",
            data: updatedRecipe
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui resep",
            data: error.message
        });
    }
};

export const DeleteRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.recipe.delete({
            where: { id: Number(id) }
        })
        res.status(204).json({
            success: true,
            message: "Resep berhasil dihapus"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Gagal menghapus resep",
            msg: error.message
        });
    }
};


export const GetRecipeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const byId = await prisma.recipe.findUnique({
            where: { id: Number(id) },
            include: {
                ingredients: true,
                steps: true
            }
        });
        if (!byId) {
            res.status(404).json({
                success: false,
                message: "Resep tidak ditemukan"
            })
            return
        }
        res.status(200).json({
            success: true,
            message: "Resep berhasil ditemukan",
            data: byId
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Gagal menemukan resep",
            msg: error.message
        });
    }
}


