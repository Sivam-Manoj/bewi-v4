import { getEmployees } from "../Service/getEmployees";
import { Request, Response } from "express";
import { addEmployee } from "../Service/employeeAuthService";
import expressAsyncHandler from "express-async-handler";
import { updateEmployees } from "../Service/updateEmployee";

export const getEmployee = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      await getEmployees(req, res);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const addEmployees = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, role, password } = req.body;
    try {
      const employee = await addEmployee({ name, email, role, password });
      res.status(200).json(employee);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateEmployee = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { username, email, role, password } = req.body;
    try {
      const { message } = await updateEmployees(
        id,
        username,
        email,
        role,
        password
      );

      res.status(200).json(message);
    } catch (error) {
      throw new Error("Error While Updating");
    }
  }
);
