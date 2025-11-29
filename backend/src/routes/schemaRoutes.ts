import { Router } from "express";
import { getFormSchema } from "../controllers/schemaController";

const router = Router();

router.get("/form-schema", getFormSchema);

export default router;