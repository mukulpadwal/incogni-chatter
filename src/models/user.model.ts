import mongoose, { Schema, Document } from "mongoose";

// MessageSchema

export interface Message extends Document {
    message: string,
}

export const messageSchema: Schema<Message> = new Schema({
    message: {
        type: String,
        required: [true, "Please write a message..."]
    }
}, { timestamps: true });


// User Schema

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    isAcceptingMessage: boolean,
    isVerified: boolean,
    verifyOtp: string,
    verifyOtpExpiry: Date,
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username..."],
        unique: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email..."],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address..."]
    },
    password: {
        type: String,
        required: [true, "Please provide a password..."],
        trim: true,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyOtp: {
        type: String,
        required: [true, "Please enter otp..."],
    },
    verifyOtpExpiry: {
        type: Date,
    },
    messages: [messageSchema]
}, { timestamps: true });


const User = (mongoose.models.users as mongoose.Model<User>) || (mongoose.model<User>("users", userSchema));

export default User;