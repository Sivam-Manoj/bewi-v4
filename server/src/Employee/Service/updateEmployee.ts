import Auth from "../../Auth/Model/AuthModel";

export const updateEmployees = async (
  id: string,
  username: string,
  email: string,
  role: string,
  password: string
) => {
  try {
    // Find the employee by ID
    console.log(username);
    const employee = await Auth.findById(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Update the employee's fields
    employee.username = username || employee.username;
    employee.email = email || employee.email;
    employee.role = role || employee.role;
    employee.password = password || employee.password;

    // Save the updated employee
    await employee.save();

    return { message: "Employee updated successfully" };
  } catch (error: any) {
    throw new Error(`Error while updating employee: ${error.message}`);
  }
};
