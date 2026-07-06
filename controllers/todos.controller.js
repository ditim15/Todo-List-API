const getTodos = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Todos fetched successfully"
        });
    } catch (err) {
        next(err);
    }
};
