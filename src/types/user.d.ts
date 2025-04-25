export interface UserProps {
  name: string;
  email: string;
  password?: string;
  avatar?: string | " ";
  updatedAt?: Date;
  createdAt?: Date;
}
