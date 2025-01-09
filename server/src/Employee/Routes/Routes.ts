import { Router } from "express";
import {
  addEmployees,
  getEmployee,
  updateEmployee,
} from "../Controller/EmployeeController";
const router = Router();

router.get("/get-all", getEmployee);
router.post("/add-one", addEmployees);
router.put("/update/:id", updateEmployee);
export default router;
