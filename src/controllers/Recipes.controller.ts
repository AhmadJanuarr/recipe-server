import { prisma } from "../../prisma/client/prisma";
import { Request, Response } from "express";

export const GetRecipes = async (req: Request, res: Response) => {
    const recipes = await prisma.recipe.findMany({
        include: {
            ingredients: true
        }
    });
}