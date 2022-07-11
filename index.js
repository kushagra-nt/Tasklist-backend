import express from "express";
import mongoose from "mongoose";
import apiRoutes from "./routes/api.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", apiRoutes);

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => app.listen(5000, () => console.log("server started on port 5000")))
  .catch((error) => console.log(error));
