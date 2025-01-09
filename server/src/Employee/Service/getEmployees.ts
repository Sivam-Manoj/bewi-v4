import { Request, Response } from "express";
import Auth from "../../Auth/Model/AuthModel";

export const getEmployees = async (req: Request, res: Response) => {
  const employees = await Auth.find();

  if (!employees) {
    throw new Error("No Employees Found");
  }

  res.status(200).json(employees);
};
