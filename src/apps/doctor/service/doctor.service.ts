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
  body: any,
) => {
  const doctor = await Doctor.findOne({ ...filter, isDeleted: false });
  if (!doctor) throw new AppError("Doctor Not found", 404);

 
  if (body.specialization) doctor.specialization = body.specialization;
  if (body.experience) doctor.experience = body.experience;
  if (body.consultationFee) doctor.consultationFee = body.consultationFee;
  if (body.bio) doctor.bio = body.bio;
  await doctor.save();

  if (body.name || body.phone) {
    await User.findByIdAndUpdate(doctor.user, {
      ...(body.name && { name: body.name }),
      ...(body.phone && { phone: body.phone }),
    });
  }

  return Doctor.findById(doctor._id).populate("user", "name email phone");
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
