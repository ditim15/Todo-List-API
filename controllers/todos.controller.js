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

        const updated = await pool.query(
            'UPDATE todos SET title = $1, description = $2, completed = $3'
            + ' WHERE id = $4 AND user_id = $5 RETURNING *', [req.body.title, req.body.description, req.body.completed, req.params.id, req.user.id]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }
        res.status(200).json({
            message: "Todo updated successfully",
            todo: updated.rows[0]
        });
    } catch (err) {
        next(err);
    }
};

const deleteTodo = async (req, res, next) => {
    try {

        const deleted = await pool.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.params.id, req.user.id]
        );

        if (deleted.rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully",
            todo: deleted.rows[0]
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