import { Supabase } from "../config/supabase.config";

export const UploadImageToSupabase = async (file: Express.Multer.File) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const { data, error } = await Supabase.storage.from("images").upload(fileName, file.buffer);
  if (error) {
    throw new Error(error.message);
  }
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
};
