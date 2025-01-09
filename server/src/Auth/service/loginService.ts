import { AsyncError } from "biezor";
import Auth, { IAuth } from "../Model/AuthModel";

export const loginService = async (email: string, password: string) => {
  const user = (await Auth.findOne({ email })) as IAuth | null;

  if (!user) {
    throw new AsyncError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  console.log("Password comparison result:", isPasswordCorrect); // Log the result

  if (!isPasswordCorrect || !user.active) {
    throw new AsyncError("Invalid credentials");
  }

  const userId = user._id;
  return { userId, name: user.username, email: user.email, role: user.role };
};
