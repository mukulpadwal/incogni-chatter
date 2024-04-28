import { auth } from "@/auth";
import connectToDb from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;
    await connectToDb();
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized Request." },
            { status: 401 }
        );
    }

    try {
        const updatedResult = await User.updateOne(
            { _id: session.user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Message not found or already deleted." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Message Deleted Successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error(`Error while deleting message : ERROR : ${error}`);
        return NextResponse.json(
            {
                success: false,
                message: `Error while deleting message : ERROR : ${error}`,
            },
            { status: 500 }
        );
    }
}
