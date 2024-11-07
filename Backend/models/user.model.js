import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { errorHandler } from '../utils/errorHandler.js';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: { 
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    attendanceCount: {
        type: Number,
        default: 0
    },
    leavesTaken: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String, 
        default: ''
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
})

// // Hashing Password
// UserSchema.pre('save', async (next) => {
//     if(!this.isModified('password')) return next();

//     if(this.password.length < 8) {
//         return next(errorHandler(400, "Password must be at least 8 characters."))
//     }
    
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt)
//     next();
// })

export const User = mongoose.model('User', UserSchema)