import express from "express";
import { createList, createTask, taskList, getAllTasklists } from "../controllers/index.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.post("/createtasklist", createList);

router.post("/createtask", validate, createTask);

router.get("/tasklist/:taskListId", taskList);

router.get("/getalltasklists", getAllTasklists);

export default router;
