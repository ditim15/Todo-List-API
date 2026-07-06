import express from "express";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

const app = express();

app.use(express.json());

const startServer = async () => {
    try {
        app.on("error", (err) => {
            console.log("Error", err);
            throw err;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.log("Error starting server: ", err);
    }
} 

startServer();

export default app;