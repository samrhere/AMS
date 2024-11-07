import { Attendance } from '../models/attendance.model.js';
import { Grade } from '../models/grade.model.js';
import { errorHandler } from '../utils/errorHandler.js';

const calculateGrade = (attendancePercentage) => {
  if (attendancePercentage >= 90) return 'A';
  else if (attendancePercentage >= 80) return 'B';
  else if (attendancePercentage >= 70) return 'C';
  else if (attendancePercentage >= 60) return 'D';
  else return 'F';
};

export const markAttendance = async (req, res, next) => {
  try {
    const studentId = req.user._id
    const { date, status } = req.body;

    const existingAttendance = await Attendance.findOne({ studentId, date });

    if (existingAttendance) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for this date' });
    }

    const attendance = await Attendance.create({ studentId, date, status });

    try {
      const totalClasses = await Attendance.countDocuments({ studentId });
      const attendedClasses = await Attendance.countDocuments({ studentId, status: 'Present' });

      if (totalClasses === 0) {
        throw new Error("No attendance records found for this user.");
      }

      // Calculate attendance percentage
      const attendancePercentage = (attendedClasses / totalClasses) * 100;
      const grade = calculateGrade(attendancePercentage);
      console.log("GRADE::: ", grade);

      // Update or insert grade record
      await Grade.updateOne(
        { studentId },
        { $set: { totalClasses, attendedClasses, attendancePercentage, grade } },
        { upsert: true }
      );

      res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendance,
        attendancePercentage,
        grade
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
};


export const getAttendanceRecords = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const records = await Attendance.find({ studentId }).populate('studentId')
    
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving attendance records', error: error.message });
  }
};

export const getAttendances = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    if (userRole!== "admin") {
      next(errorHandler(500, "NOT ALLOWED!"))
    }
    const records = await Attendance.find().populate('studentId')
    
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving attendance records', error: error.message });
  }
};