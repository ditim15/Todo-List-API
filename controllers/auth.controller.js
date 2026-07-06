const registerUser = async (req, res, next) => {
    try {
        const {username, email, password } = req.bodyl

        res.status(201).json({ 
            message: "User registered successfully" 
        });
    } catch (err) {
        next(err);
    }
};

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