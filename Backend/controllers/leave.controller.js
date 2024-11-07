import { Attendance } from "../models/attendance.model.js";
import { Leave } from "../models/leave.model.js";
import { User } from "../models/User.model.js";
import { errorHandler } from "../utils/errorHandler.js";

// Request for Leave
export const requestLeave = async (req, res, next) => {
  try {
    const { leaveDate, reason } = req.body;
    const studentId = req.user.id

    const leaveRequest = new Leave({
      studentId,
      leaveDate,
      reason,
      status: 'Pending',
    });
    await leaveRequest.save();

    res.status(201)
      .json({ success: true, message: 'Leave request submitted successfully', data: leaveRequest });
  } catch (error) {
    res.status(500)
      .json({ success: false, message: 'Error submitting leave request', error: error.message });
  }
};

// View Leave Requests
export const getLeaveRequests = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "admin") {
      next(errorHandler(500, "NOT ALLOWED!"))
    }
    const leaveRequests = await Leave.find().populate('studentId')

    res.status(200).json({ success: true, data: leaveRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving leave requests', error: error.message });
  }
};


export const updateLeaveRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // New status, such as 'Approved' or 'Rejected'


    if(req.user.role!== "admin"){
      next(errorHandler(500, "NOT ALLOWED!"))
    }
    
    const updatedLeaveRequest = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    

    if (!updatedLeaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }
    const currentDate = new Date();
  
  // Optional: Format the date if needed (e.g., to a readable string)
  const formattedDate = currentDate.toISOString();

    const updatedAttendance = await Attendance.create({
      studentId: updatedLeaveRequest.studentId,
      status: "Leave",
      date: formattedDate
    })
   
    
      res.status(200).json({
        success: true,
        message: 'Leave request status updated successfully',
        data: updatedLeaveRequest,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating leave request status',
      error: error.message,
    });
  }
};

export const getStudentLeaveRecords = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const leaveRecords = await Leave.find({ studentId })
      .sort({ leaveDate: -1 }); // Sort by leaveDate in descending order

    if (!leaveRecords || leaveRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No leave records found for the specified student',
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving leave records',
      error: error.message,
    });
  }
};