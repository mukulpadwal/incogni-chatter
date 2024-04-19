import connectToDb from "@/lib/dbConnect";
import User from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signup.schema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest) {
    await connectToDb();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return NextResponse.json({ success: false, message: usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid Query Parameters..." }, { status: 400 });
        }

        const { username } = result.data;

        const existingVerifiedUser = await User.findOne({
            username, isVerified: true
        });

        if (existingVerifiedUser) {
            return NextResponse.json({ success: false, message: "Username already taken..." }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Username available..." }, { status: 200 });


    } catch (error: any) {
        console.error(`Error checking username : ERROR : ${error}`);
        return NextResponse.json({ success: false, message: `Error checking username : ERROR : ${error}` }, { status: 500 });
    }
}