import {signUp, logIn} from "../controllers/authController.js"
import {Router} from "express"

const router = Router();

router.post("/register", signUp)
router.post("/login", logIn);

export default router;