import { Router } from "express";
import {
  createSubmissionHandler,
  listSubmissionsHandler,
  updateSubmissionHandler,
  deleteSubmissionHandler,
  exportSubmissionsCsvHandler,
} from "../controllers/submissionsController";

const router = Router();

router.post("/submissions", createSubmissionHandler);
router.get("/submissions", listSubmissionsHandler);
router.put("/submissions/:id", updateSubmissionHandler);
router.delete("/submissions/:id", deleteSubmissionHandler);
router.get("/submissions/export", exportSubmissionsCsvHandler);

export default router;