import pool from '../db/pool.js';

// Gets all todos for the authenticated user.
const getTodos = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM todos WHERE user_id = $1', [req.user.id]
        );

        res.status(200).json({
            message: "Todos fetched successfully",
            todos: result.rows
        });
    } catch (err) {
        next(err);
    }
};

// Creates a new todo for the user.
const createTodo = async (req, res, next) => {
    try {

        const { title, description, completed } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const todo = await pool.query(
            'INSERT INTO todos (user_id, title, description, completed)'
            + ' VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, completed, req.user.id]
        );

        res.status(201).json({
            message: "Todo created successfully",
            title: todo.rows[0].title,
            description: todo.rows[0].description,
            completed: todo.rows[0].completed
        });
    } catch (err) {
        next(err);
    }
};

const updateTodo = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Todo updated successfully"
        });
    } catch (err) {
        next(err);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Todo deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
}