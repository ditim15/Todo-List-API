const registerUser = async (req, res, next) => {
    try {
        const {username, email, password } = req.bodyl

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        next(err);
    }
}