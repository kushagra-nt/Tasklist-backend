import express from "express";
import { createList, createTask, taskList } from "../controllers/index.js";

const router = express.Router();

router.post("/createtasklist", createList);

router.post("/createtask", createTask);

router.get("/tasklist/:taskListId", taskList);

export default router;
