import express from "express";
import {
  getAllTrademark,
  getTrademarkDetails,
} from "../controllers/proxyControllers.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { logRequest } from "../config/logConfig.js";

const proxyRouter = express.Router();

proxyRouter.use(logRequest);

proxyRouter.get("/search", ctrlWrapper(getAllTrademark));

proxyRouter.get("/details", ctrlWrapper(getTrademarkDetails));

export default proxyRouter;
