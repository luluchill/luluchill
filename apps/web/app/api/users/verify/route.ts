import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { ethAddress } = await request.json();

    if (!ethAddress) {
      return NextResponse.json(
        { error: "Ethereum address is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { ethAddress },
      data: { isEasIssued: true },
    });

    return NextResponse.json({ message: "User verified successfully", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    );
  }
}
