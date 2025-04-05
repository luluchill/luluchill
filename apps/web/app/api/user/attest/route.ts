import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id, attestationUid } = await request.json();
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId") as "80002" | "133";

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

    let data: Parameters<typeof prisma.user.update>[0]["data"];
    switch (chainId) {
      case "80002": // Polygon Amoy Testnet
        data = {
          attestationUidPolygon: attestationUid,
        };
        break;
      case "133": // HashKey Chain Testnet
        data = {
          attestationUidHashkey: attestationUid,
        };
        break;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
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
