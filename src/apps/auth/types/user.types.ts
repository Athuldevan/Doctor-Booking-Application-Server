export type Role = "admin" | "patient" | 'doctor';

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  isDeleted: boolean;
}
