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



        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email.toLowerCase()]
        );


        if (existingUser.rows.length > 0) {
            return res.status(409).json({ 
                message: "User already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email.toLowerCase(), hashedPassword]
        );

        const token = jwt.sign(
            { id: newUser.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: _, ...safeUser } = newUser.rows[0];

        res.status(201).json({ 
            message: "User registered successfully",
            user: safeUser,
            token: token
        });
    } catch (err) {
        next(err);
    }
};

// Logs in an existing user.
const loginUser = async (req, res, next) => {
    try {
        const {email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token: token
        });

    } catch (err) {
        next(err);
    }
};

export {
    registerUser,
    loginUser
}