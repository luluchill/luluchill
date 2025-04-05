import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const chainId = searchParams.get("chainId");
    if (!chainId) {
      return NextResponse.json(
        { error: "Missing chainId parameter" },
        { status: 400 }
      );
    }
    if (chainId !== "80002" && chainId !== "133") {
      return NextResponse.json({ error: "Invalid chainId" }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        [chainId === "80002"
          ? "attestationUidPolygon"
          : "attestationUidHashkey"]: null,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
