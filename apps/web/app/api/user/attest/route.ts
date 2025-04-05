import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id, attestationUid } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { attestationUid },
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
