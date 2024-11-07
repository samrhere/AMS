import { verifyUser } from "../middlewares/verifyToken.js";
import { markAttendance, getAttendanceRecords, getAttendances } from "../controllers/attendance.controller.js";
import {Router} from 'express'

const router = Router();

router.post('/mark-attendance', verifyUser, markAttendance)
router.get('/get-record', verifyUser, getAttendanceRecords)
router.get('/get-attendances', verifyUser, getAttendances)

export default router