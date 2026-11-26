
import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} from "../controllers/todoController.js";

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
