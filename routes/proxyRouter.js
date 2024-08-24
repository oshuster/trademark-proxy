import express from "express";
import { getTrademark } from "../controllers/proxyControllers.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { logRequest } from "../config/logConfig.js";

const proxyRouter = express.Router();

proxyRouter.use(logRequest);

proxyRouter.get("/search", ctrlWrapper(getTrademark));

export default proxyRouter;
