import { Request, Response } from "express";
import { employeeOnboardingSchema } from "../formSchema/employeeOnboarding";

export function getFormSchema(_req: Request, res: Response) {
  return res.status(200).json({ schema: employeeOnboardingSchema });
}