import express from "express";
import cors from "cors";
import apiRouter from "./routes";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/rest/v1", apiRateLimiter, apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;