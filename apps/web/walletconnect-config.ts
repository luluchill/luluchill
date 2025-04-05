import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "@reown/appkit/networks";
// Get projectId from https://cloud.reown.com
export const projectId = "5e693ef23579098865c56161ffb25293";

if (!projectId) {
  throw new Error("Project ID is not defined");
}
// 定義 HashKey Chain Testnet
export const hashKeyChainTestnet = defineChain({
  id: 133,
  caipNetworkId: "eip155:133",
  chainNamespace: "eip155",
  name: "HashKey Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "HSK",
    symbol: "HSK",
  },
  rpcUrls: {
    default: {
      http: ["https://hashkeychain-testnet.alt.technology"],
    },
  },
  blockExplorers: {
    default: {
      name: "HashKeyScan",
      url: "https://hashkeychain-testnet-explorer.alt.technology",
    },
  },
  testnet: true,
});

// 定義 Polygon Amoy 測試網
export const polygonAmoy = defineChain({
  id: 80002,
  caipNetworkId: "eip155:80002",
  chainNamespace: "eip155",
  name: "Amoy",
  nativeCurrency: {
    decimals: 18,
    name: "POL",
    symbol: "POL",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology/"],
    },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://amoy.polygonscan.com" },
  },
  testnet: true,
});

export const networks = [hashKeyChainTestnet, polygonAmoy];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
