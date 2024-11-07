import mongoose, { Schema } from 'mongoose'

const gradeSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalClasses: {
    type: Number,
    required: true,
  },
  attendedClasses: {
    type: Number,
    required: true,
  },
  attendancePercentage: {
    type: Number,
  },
  grade: {
    type: String,
  },
}, { timestamps: true });

export const Grade = mongoose.model("Grade", gradeSchema);