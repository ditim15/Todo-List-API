
// Register a new user.
const registerUser = async (req, res, next) => {
    try {
        const {username, email, password } = req.body;

        res.status(201).json({ 
            message: "User registered successfully" 
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