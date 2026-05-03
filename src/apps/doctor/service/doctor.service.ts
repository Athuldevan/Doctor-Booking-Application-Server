import { FileIcon } from "lucide-react";
import { AppError } from "../../../utils/AppError";
import Doctor from "../models/doctor.model";
import { IDoctor } from "../types/doctor.types";
import User from "../../auth/model/user.model";
import bcrypt from "bcrypt";

export const addDoctorService = async (
  body: Partial<IDoctor> & {
    name: string;
    email: string;
    phone: string;
    password: string;
  },
) => {
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) throw new AppError("Email already exists", 400);

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = await User.create({
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: hashedPassword,
    role: "doctor",
  });

  return Doctor.create({
    user: user._id,
    specialization: body.specialization,
    experience: body.experience,
    consultationFee: body.consultationFee,
    bio: body.bio,
  });
};

export const getAllDoctorsService = async (query: Partial<IDoctor>) => {
  const doctor = await Doctor.find({ ...query, isDeleted: false }).populate(
    "user",
    "name email phone",
  );

  if (!doctor) throw new AppError("No Data found", 404);
  return doctor;
};

export const updateADoctorService = async (
  filter: Partial<IDoctor>,
  body: Partial<IDoctor>,
) => {
  const doctor = await Doctor.findOneAndUpdate(
    { ...filter, isDeleted: false },
    { ...body },
    { new: true },
  )
    .populate("user", "name email phone")
    .lean(true);

  if (!doctor) throw new AppError("Doctor Not found", 404);
  return doctor;
};

export const deleteADoctorService = async (
  filter: Partial<IDoctor>,
  body: Partial<IDoctor>,
) => {
  const doctor = await Doctor.findOneAndUpdate(
    { ...filter, isDeleted: false },
    { isDeleted: true },
    { new: true },
  ).lean(true);
  if (!doctor) throw new AppError("Doctor Not found", 404);
  return doctor;
};

export const getADoctorService = async (filter: Partial<IDoctor>) => {
  const doctor = await Doctor.findOne({ ...filter, isDeleted: false }).lean(
    true,
  );
  if (!doctor) throw new AppError("Doctor Not found", 404);
  return doctor;
};
