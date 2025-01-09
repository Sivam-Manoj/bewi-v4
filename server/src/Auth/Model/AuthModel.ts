import { Schema, model, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

// Define the Auth interface for TypeScript
export interface IAuth extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  role: string;
  active: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const authSchema = new Schema<IAuth>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["user", "admin", "super_admin"],
        message: "Role must be either 'user', 'admin', or 'super_admin'. ",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

authSchema.pre("save", async function (next) {
  const user = this as IAuth;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (error: any) {
    return next(error);
  }
});

authSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Auth: Model<IAuth> = model<IAuth>("Auth", authSchema);

export default Auth;
