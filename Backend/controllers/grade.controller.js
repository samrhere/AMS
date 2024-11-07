import { Grade } from "../models/grade.model.js";

export const getGrades = async (req, res, next) => {
    try {
        const studentId = req.user._id;
        console.log(studentId);
        
        const grade = await Grade.findOne({ studentId });
        console.log(grade);
        
        if (grade) {
          res.status(200).json({
            success: true,
            data: grade,
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Grade record not found for this user',
          });
        }
      } catch (error) {
        console.error('Error fetching grade:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
}

export const getGradesForAdmin = async (req, res,next) => {
  try {
    if(!req.user.role === "admin") {
      res.json({ success: false, data: "Unauthorized access" });
    }
    const grades = await Grade.find().populate('studentId', 'username'); // Populate studentId to get the username
       
    res.json({ success: true, data: grades });
} catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch grades' });
}
}