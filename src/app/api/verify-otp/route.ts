import connectToDb from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await connectToDb();

    try {
        const { username, otp } = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await User.findOne({
            username: decodedUsername
        })

        if (!user) {
            return NextResponse.json({ success: false, message: `User not found...` }, { status: 400 });
        }

        const isOtpCorrect = user.verifyOtp === otp;
        const isOtpNotExpired = new Date(user.verifyOtpExpiry) > new Date();

        if (isOtpCorrect && isOtpNotExpired) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json({ success: true, message: `Account verified successfully...` }, { status: 200 });
        } else if (!isOtpNotExpired) {
            return NextResponse.json({ success: false, message: `OTP expired...` }, { status: 400 });
        } else {
            return NextResponse.json({ success: false, message: `Incorrect otp...` }, { status: 400 });
        }

    } catch (error: any) {
        console.error(`Error checking username : ERROR : ${error}`);
        return NextResponse.json({ success: false, message: `Error verifying OTP : ERROR : ${error}` }, { status: 500 });
    }
}
