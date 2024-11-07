import {Router} from 'express';
import { getGrades, getGradesForAdmin } from '../controllers/grade.controller.js';
import { verifyUser } from '../middlewares/verifyToken.js'

const router = Router()

router.get('/get-student-grades', verifyUser, getGrades)
router.get('/get-grades', verifyUser, getGradesForAdmin)

export default router