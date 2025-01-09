import Auth from "../../Auth/Model/AuthModel";
import { AddEmployeeParams } from "../Types/ParamTypes/EmployeeParams";

export const addEmployee = async ({
  name,
  email,
  role,
  password,
}: AddEmployeeParams) => {
  if (!name || !email || !role || !password) {
    throw new Error("All fields are required");
  }

  const employee = new Auth({
    username: name,
    email,
    role,
    password,
  });

  try {
    const employees = await employee.save();

    const { password: _, ...employeeWithoutPassword } = employees.toObject();
    return employeeWithoutPassword;
  } catch (error) {
    throw new Error("Internal server error");
  }
};
