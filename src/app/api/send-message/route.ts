import connectToDb from "@/lib/dbConnect";
import User, { Message } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectToDb();

    try {
        const { username, message } = await request.json();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found..." },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                { success: false, message: "User not accepting messages..." },
                { status: 403 }
            );
        }

        const newMessage = { message };

        user.messages.push(newMessage as Message);

        await user.save();

        return NextResponse.json(
            { success: true, message: "Message sent successfully..." },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(`Error while sending message : ERROR : ${error}`);

        return NextResponse.json(
            {
                success: false,
                message: `Error while sending message : ERROR : ${error}`,
            },
            { status: 500 }
        );
    }
}
