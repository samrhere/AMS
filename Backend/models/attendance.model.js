import mongoose, { Schema } from 'mongoose'

const attendanceSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Leave'],
        required: true,
    },
})

export const Attendance = mongoose.model('Attendance', attendanceSchema)