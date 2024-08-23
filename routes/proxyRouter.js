import express from "express";
import { getTrademark } from "../controllers/proxyControllers.js";

const proxyRouter = express.Router();

proxyRouter.get("/search", getTrademark);

export default proxyRouter;
