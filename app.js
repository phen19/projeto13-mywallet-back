import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import authRouter from "./routes/authRouter.js"
import entryRouter from "./routes/entryRouter.js"

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());


//Auth routes
server.use(authRouter);
server.use(entryRouter);


const PORT = process.env.PORT || 5001


server.listen(PORT, () => {
    console.log(`Server is litening on port ${PORT}.`);
});