import connectToDb from "@/lib/dbConnect";
import User from "@/models/user.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { User as UserType } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    await connectToDb();

    try {
        const session = await auth();
        const user: UserType = session?.user || {};

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Not Autenticated..." },
                { status: 401 }
            );
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        const foundUser = await User.aggregate([
            // 1.
            {
                $match: { _id: userId },
            },

            // 2.
            {
                $unwind: "$messages",
            },

            // 3.
            {
                $sort: { "messages.createdAt": -1 },
            },

            // 4.
            {
                $group: { _id: "$_id", messages: { $push: "$messages" } },
            },
        ]);

        if (!foundUser || foundUser.length === 0) {
            return NextResponse.json(
                { success: false, message: "User not found..." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Fetched all messages successfully...",
                messages: foundUser[0].messages,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(`Error while fetching all the messages : ERROR : ${error}`);

        return NextResponse.json(
            {
                success: false,
                message: `Error while fetching all the messages : ERROR : ${error}`,
            },
            { status: 500 }
        );
    }
}
