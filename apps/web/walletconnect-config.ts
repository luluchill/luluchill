import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "@reown/appkit/networks";
// Get projectId from https://cloud.reown.com
export const projectId = "5e693ef23579098865c56161ffb25293";

import { FallbackProvider, JsonRpcProvider } from 'ethers'
import { useMemo } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient, useClient } from 'wagmi'


export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network),
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = useClient<Config>({ chainId })
  return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}



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
      http: ["https://hashKeychain-testnet.alt.technology"],
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

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,

  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/'),
    [hashKeyChainTestnet.id]: http('https://hashKeychain-testnet.alt.technology'),
  },
});

export const config = wagmiAdapter.wagmiConfig;
