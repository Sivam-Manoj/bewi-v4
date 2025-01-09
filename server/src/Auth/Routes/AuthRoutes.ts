import express from "express";
import { blockUsers, login } from "../Controllers/AuthController";

const router = express.Router();

router.post("/login", login);
router.delete("/block/:id", blockUsers);
export default router;
