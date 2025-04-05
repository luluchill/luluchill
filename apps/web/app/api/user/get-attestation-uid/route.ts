import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ethAddress = searchParams.get("ethAddress");

  if (!ethAddress) {
    return NextResponse.json(
      { error: "Missing ethAddress parameter" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        ethAddress,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ attestationUid: user.attestationUid });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
