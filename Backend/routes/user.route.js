import { Router } from 'express'
import { verifyUser } from '../middlewares/verifyToken.js'
import { editProfile } from '../controllers/user.controller.js';

const router = Router();

router.put("/edit-profile", verifyUser, editProfile)

export default router;