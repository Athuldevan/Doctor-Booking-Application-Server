import { Request, Response } from "express";
import {
  addDoctorService,
  deleteADoctorService,
  getADoctorService,
  getAllDoctorsService,
  updateADoctorService,
} from "../service/doctor.service";

export const addDoctor = async (req: Request, res: Response) => {
  const doctor = await addDoctorService(req.body);
  return res.status(201).json({
    status: "success",
    message: "Doctor added successfully",
    data: doctor,
  });
};

export const getAllDoctor = async (req: Request, res: Response) => {
  const doctors = await getAllDoctorsService(req.query);
  return res.status(200).json({
    status: "success",
    message: "Doctors fetched",
    data: doctors,
  });
};

export const getADoctor = async (req: Request, res: Response) => {
  const doctor = await getADoctorService({ _id: req.params.id } as any);
  return res.status(200).json({
    status: "success",
    message: "Doctor fetched",
    data: doctor,
  });
};

export const updateADoctor = async (req: Request, res: Response) => {
  const doctor = await updateADoctorService(
    { _id: req.params.id } as any,
    req.body
  );
  return res.status(200).json({
    status: "success",
    message: "Doctor updated",
    data: doctor,
  });
};

export const deleteADoctor = async (req: Request, res: Response) => {
  const doctor = await deleteADoctorService({ _id: req.params.id } as any, {});
  return res.status(200).json({
    status: "success",
    message: "Doctor deleted",
    data: doctor,
  });
};
