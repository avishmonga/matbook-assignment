import { Router } from "express";
import schemaRoutes from "./schemaRoutes";
import submissionsRoutes from "./submissionsRoutes";

const router = Router();

router.use(schemaRoutes);
router.use(submissionsRoutes);

export default router;