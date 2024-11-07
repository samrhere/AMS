import mongoose, { Schema } from 'mongoose'

const leaveSchema = new Schema({
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model
      },
      LeaveDate: {
        type: Date
      },
      reason: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

export const Leave = mongoose.model('Leave', leaveSchema)