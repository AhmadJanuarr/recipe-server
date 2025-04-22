import { Supabase } from "../config/supabase.config";

export const UploadImageRecipeToSupabase = async (file: Express.Multer.File) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  if (!file) return console.log("file not found");
  const { data, error } = await Supabase.storage.from("images").upload(fileName, file.buffer);
  if (error) {
    throw new Error(error.message);
  }
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
};

export const UploadImageAvatarToSupabase = async (file: Express.Multer.File, userId: number) => {
  if (!file) return console.log("file not found");
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `${userId}/${fileName}`;
  const { data, error } = await Supabase.storage.from("avatars").upload(filePath, file.buffer);
  if (error) {
    throw new Error(error.message);
  }
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars/${userId}/${fileName}`;
};
