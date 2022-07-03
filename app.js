import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { logIn, signUp } from "./controllers/authController.js";


dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());


//Auth routes
server.post("/register", signUp)
server.post("/login", logIn);


server.listen(process.env.PORT, () => {
    console.log(`Server is litening on port ${process.env.PORT}.`);
});