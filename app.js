import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import proxyRouter from "./routes/proxyRouter.js";
import { serviceLogger } from "./config/logConfig.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/proxy", proxyRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  serviceLogger.info(`Server is running. Use our API on port: ${PORT}`);
  console.log(`Server is running. Use our API on port: ${PORT}`);
});
