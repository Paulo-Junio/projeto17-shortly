import {Router} from 'express';

import { DeleteUrls, GetUrlById, OpenUrl, PostUrl, GetUserUrls, GetRanking } from '../controllers/urlsControllers.js';
import {DeleteUrlValidation, PostUrlValidation, GetUserUrlsValidation} from "../middlewares/urlsValidationMiddlewares.js"

const router = Router();

router.post("/urls/shorten", PostUrlValidation, PostUrl);
router.get("/urls/:id", GetUrlById);
router.get("/urls/open/:shortUrl",OpenUrl);
router.get("/users/me",GetUserUrlsValidation, GetUserUrls);
router.get("/ranking", GetRanking);
router.delete("/urls/:id",DeleteUrlValidation, DeleteUrls);

export default router;