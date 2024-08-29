import https from "https";
import fs from "fs";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import proxyRouter from "./routes/proxyRouter.js";
import { serviceLogger } from "./config/logConfig.js";

// const PORT = process.env.PORT || 3000;
const SSL_PORT = process.env.SSL_PORT || 3443;

const httpsOptions = {
  key: fs.readFileSync("./cert/server.key"),
  cert: fs.readFileSync("./cert/server.cert"),
};

const app = express();

app.use(morgan("tiny"));
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json());

app.use("/api/proxy", proxyRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

https.createServer(httpsOptions, app).listen(SSL_PORT, () => {
  serviceLogger.info(
    `HTTPS Server is running. Use our API on port: ${SSL_PORT}`
  );
  console.log(`HTTPS Server is running. Use our API on port: ${SSL_PORT}`);
});

// app.listen(PORT, () => {
//   serviceLogger.info(`Server is running. Use our API on port: ${PORT}`);
//   console.log(`Server is running. Use our API on port: ${PORT}`);
// });
