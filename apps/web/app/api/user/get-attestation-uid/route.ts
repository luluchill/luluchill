import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ethAddress = searchParams.get("ethAddress");

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

    let attestationUid: string | null = null;
    switch (chainId) {
      case "80002": // Polygon Amoy Testnet
        attestationUid = user.attestationUidPolygon;
        break;
      case "133": // HashKey Chain Testnet
        attestationUid = user.attestationUidHashkey;
        break;
    }

    return NextResponse.json({ attestationUid });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
