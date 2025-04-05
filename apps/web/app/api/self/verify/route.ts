import { NextResponse } from "next/server";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { proof, publicSignals } = body;

    if (!proof || !publicSignals) {
      return NextResponse.json(
        { error: "Proof and publicSignals are required" },
        { status: 400 }
      );
    }

    const userId = await getUserIdentifier(publicSignals, "hex");

    const configuredVerifier = new SelfBackendVerifier(
      "luluchill",
      "https://luluchill.vercel.app",
      "hex",
      true
    );

    const result = await configuredVerifier.verify(proof, publicSignals);

    if (result.isValid) {
      await prisma.user.create({
        data: {
          ethAddress: userId,
          passportNumber: result.credentialSubject.passport_number!,
          firstName: (result.credentialSubject.name! as any as string[])[0],
          lastName: (result.credentialSubject.name! as any as string[])[1],
          nationality: result.credentialSubject.nationality!,
          olderThan: result.credentialSubject.older_than!,
          passportNoOfac: result.credentialSubject.passport_no_ofac!,
          attestationUidPolygon: null,
          attestationUidHashkey: null,
        },
      });

      return NextResponse.json(
        { status: "success", result: result.isValid },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          result: result.isValid,
          message: "Verification failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error verifying proof",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
