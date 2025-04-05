"use client";

import React from "react";
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";

function Playground() {
  const userId = "0x0123459dc0D3b5c70609F66E461dcB8EaAeFB5cc";

  const selfApp = new SelfAppBuilder({
    appName: "LuLuChill",
    scope: "luluchill",
    endpoint: "http://luluchill.kth.tw/api/self/verify",
    endpointType: "staging_https",
    logoBase64:
      "https://upload.wikimedia.org/wikipedia/commons/f/f9/L_cursiva.gif",
    userIdType: "hex",
    userId,
    disclosures: {
      name: true,
      minimumAge: 18,
    },
    devMode: true,
  } as Partial<SelfApp>).build();

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <SelfQRcodeWrapper
        selfApp={selfApp}
        onSuccess={() => {
          console.log("Verification successful");
        }}
        darkMode={false}
      />
    </div>
  );
}

export default Playground;
