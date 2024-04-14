import connectToDb from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/helpers/ApiResponse";



export async function POST(request: NextRequest) {
    await connectToDb();

    try {
        const { username, email, password } = await request.json();

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUserWithEmailAndIsVerified = await User.findOne({
            email,
            isVerified: true
        });

        if (existingUserWithEmailAndIsVerified) {
            // User is already verified
            if (existingUserWithEmailAndIsVerified.isVerified) {
                return NextResponse.json(new ApiResponse(false, "User with same email already exists.", {}),
                    {
                        status: 400
                    }
                );
            } else {

            }

        } else {
            // Create a new user and save it
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                isAcceptingMessage: true,
                isVerified: false,
                verifyOtp: OTP,
                verifyOtpExpiry: Date.now() + 3600000,
                messages: []
            });

            await newUser.save();
        }

        // const emailResponse = await sendVerificationEmail(email, username, OTP);

        // if (!emailResponse.success) {
        //     return NextResponse.json(new ApiResponse(false, emailResponse.message, {}),
        //         {
        //             status: 500
        //         }
        //     );
        // }

        return NextResponse.json(new ApiResponse(true, "User registered successfully. Kindly check your email to verify your account.", {}),
            {
                status: 201
            }
        );



    } catch (error) {
        console.error(`Error registering user : ERROR : ${error}`)

        return NextResponse.json(new ApiResponse(false, "Error registering user.", {}),
            {
                status: 500
            }
        );
    }
}