
import Todo from "../models/Todo.js";

// GET ALL TODOS
export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: todos.length,
            todos
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch tasks."
        });
    }
};

// CREATE TODO
export const createTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required."
            });
        }

        const todo = await Todo.create({
            title,
            description,
            priority,
            dueDate: dueDate || null,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            todo
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to create task."
        });
    }
};

// UPDATE TODO
export const updateTodo = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "completed",
            "priority",
            "dueDate"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (Object.hasOwn(req.body, field)) {
                updates[field] = req.body[field];
            }
        }

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            success: true,
            todo
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to update task."
        });
    }
};

// DELETE TODO
export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            success: true,
            message: "Task deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete task."
        });
    }
};
