import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new user.
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: "Please provide name, email, and password"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ 
                message: "User already exists" 
            });
        }

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email.toLowerCase(), hashedPassword]
        );

        const { password: _, ...safeUser } = newUser.rows[0];

        res.status(201).json({ 
            message: "User registered successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

// Logs in an existing user.
const loginUser = async (req, res, next) => {
    try {
        const {email, password } = req.body;

        res.status(200).json({ 
            message: "User logged in successfully" 
        });
    } catch (err) {
        next(err);
    }
};

export {
    registerUser,
    loginUser
}