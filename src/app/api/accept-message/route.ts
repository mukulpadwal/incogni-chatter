import { auth } from "@/auth";
import connectToDb from "@/lib/dbConnect";
import User from "@/models/user.model";
import { User as UserType } from "next-auth";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDb();

  try {
    const session = await auth();
    console.log(session);

    const user: UserType = session?.user || {};

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Not Autenticated..." },
        { status: 401 }
      );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to change accepting message status.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Accepting message status changed successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      `Failed to update user status to accept messages : ERROR : ${error}`
    );
    return NextResponse.json(
      {
        success: false,
        message: `Failed to update user status to accept messages : ERROR : ${error}`,
      },
      { status: 500 }
    );
  }
}

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

    const userId = user._id;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found...",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Data fetched successfully...",
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      `Error in getting message acceptance status : ERROR : ${error}`
    );
    return NextResponse.json(
      {
        success: false,
        message: `Error in getting message acceptance status : ERROR : ${error}`,
      },
      { status: 500 }
    );
  }
}
