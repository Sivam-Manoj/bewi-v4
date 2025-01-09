import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";

// Generic validation middleware
export function validateRequest(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoObject);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      return res.status(400).json({
        message: "Validation failed",
        errors: errorMessages,
      });
    }
    next();
  };
}
