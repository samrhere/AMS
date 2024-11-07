import { verifyUser } from "../middlewares/verifyToken.js";
import { getLeaveRequests, getStudentLeaveRecords, requestLeave, updateLeaveRequestStatus } from "../controllers/leave.controller.js";
import {Router} from 'express'

const router = Router();

router.post('/request-leave', verifyUser, requestLeave)
router.get('/get-leave-requests', verifyUser, getLeaveRequests)
router.get('/get-leave-record', verifyUser, getStudentLeaveRecords)
router.post('/update-status/:id', verifyUser, updateLeaveRequestStatus)

export default router