import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ethAddress = searchParams.get("ethAddress");

    if (!ethAddress) {
      return NextResponse.json(
        { error: "Ethereum address is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { ethAddress },
    });

    const isExist = !!user;

    return NextResponse.json({ isExist });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
