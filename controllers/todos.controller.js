const getTodos = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Todos fetched successfully"
        });
    } catch (err) {
        next(err);
    }
};

const createTodo = async (req, res, next) => {
    try {
        res.status(201).json({
            message: "Todo created successfully"
        });
    } catch (err) {
        next(err);
    }
};