import {signUp, logIn} from "../controllers/authController.js"
import {Router} from "express"
import validateUserSignUp from "../middleware/validateUserSignUp.js";
import validateUserLogIn from "../middleware/validateUserLogIn.js";

const router = Router();

router.post("/register", validateUserSignUp,signUp)
router.post("/login", validateUserLogIn,logIn);

export default router;