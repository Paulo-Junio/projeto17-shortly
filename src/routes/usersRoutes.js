import {Router} from 'express';
import {SignIn, SignUp} from "../controllers/usersControllers.js";
import { userValidation, userRegisterValidation } from "../middlewares/usersValidationMiddlewares.js";


const router = Router();

router.post("/signin", userValidation, SignIn);
router.post("/signup", userRegisterValidation, SignUp);

export default router;