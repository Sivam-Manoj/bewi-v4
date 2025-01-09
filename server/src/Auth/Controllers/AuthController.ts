import { Request, Response, RequestHandler, NextFunction } from "express";
import { loginService } from "../service/loginService";
import { AsyncError, biezor } from "biezor";
import { sendTokensAsCookies } from "../../Utils/token/createTokens";
import expressAsyncHandler from "express-async-handler";
import { blockUser } from "../service/blockUser";

export const login: RequestHandler = biezor(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AsyncError("Email and password are required");
    }
    try {
      const user = await loginService(email, password);
      const { userId, name, email: userEmail, role } = user;
      const token = sendTokensAsCookies(
        res,
        String(userId),
        name,
        userEmail,
        role
      );
      res.status(200).json(token);
    } catch (error: any) {
      next(error);
    }
  }
);

export const blockUsers: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      throw new Error("No Id Found");
    }
    try {
      const { message } = await blockUser(id);

      res.status(200).json(message);
    } catch (error) {
      throw new Error("User Blocked Succesfully");
    }
  }
);
