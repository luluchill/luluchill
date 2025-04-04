import { NextResponse } from "next/server";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";

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

    const configuredVerifier = new SelfBackendVerifier(
      "luluchill",
      "https://under-blocking-illustration-atmosphere.trycloudflare.com",
      // "https://luluchill.vecel.app",
      "hex",
      true
    );

    const result = await configuredVerifier.verify(proof, publicSignals);

    if (result.isValid) {
      console.log("verify result: ", result);
      // TODO: write `result.credentialSubject` to database

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
