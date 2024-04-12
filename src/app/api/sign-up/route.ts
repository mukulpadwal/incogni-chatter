import connectToDb from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";




export async function POST(request: Request) {
    await connectToDb();

    try {
        const { username, email, password } = await request.json();
    } catch (error) {
        console.error(`Error registering user : ERROR : ${error}`)
        return Response.json({
            success: false,
            message: "Error registering user."
        }, {
            status: 500
        })
    }
}