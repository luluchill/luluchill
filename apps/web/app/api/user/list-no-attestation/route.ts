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

    const users = await prisma.user.findMany({});

    // 新增 status 欄位
    const usersWithStatus = users.map(user => ({
      ...user,
      name: user.firstName + " " + user.lastName || "",
      status: chainId === "80002"
        ? (user.attestationUidPolygon ? "approved" : "pending")
        : (user.attestationUidHashkey ? "approved" : "pending"),
    }));

    return NextResponse.json(usersWithStatus); // 返回包含 status 的使用者
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
