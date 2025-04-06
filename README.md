<div align="center">
<h1>luluchill</h1>

<p>Restricted Asset Tokenization and Liquidity Platform based on EAS (Ethereum Attestation Service)</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
</div>

### Demo Page

- Website: [luluchill.io](https://luluchill.vercel.app/)
- HashKey Chain Testnet Deployment Addresses:
  - SchemaRegistry: 0xb06FC9c63F6eB2b28B1C7EE102B4E73A47faC338
  - EAS: 0xAED1888Ab6691e86463656C586A3A4F77977C39d
  - Restricted Token: 0xd4f68460516f0Cb8FeE57b4Ac979CCc0E24352bE
  - Liquidity Pool: 0xEecDfdaeaD90f064d1Ca3A7D91F58A31a7005d99
  - MockUSDC: 0xe6FEe3091C72E5D63b943c0E813154768d187476
  
- Polygon Amoy Deployment Addresses:
  - SchemaRegistry: 0x23c5701A1BDa89C61d181BD79E5203c730708AE7
  - EAS: 0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc
  - Restricted Token: 0xA44282BC7bFB5e65732FeA13d353C3182f59af33
  - Liquidity Pool: 0x0775495b3A78055eA69ddDB4963F800fe442E8fc
  - MockUSDC: 0xd737545bE0FFcC4e3ACE1A9E664cA05e58F046f9

### Abstract

luluchill is a project combining EAS (Ethereum Attestation Service) and restricted tokens, designed specifically for Real World Asset (RWA) tokenization. Key features include:

1. **Restricted Tokens**: EAS-certified ERC-20 tokens that only allow interaction with certified liquidity pools.

2. **Certified Liquidity Pools**: Liquidity pools verified through EAS, accessible only to compliant users.

3. **Flexible Compliance Framework**: Utilizing EAS's attestation system to implement a flexible and scalable compliance framework.

### Technical Architecture

- **Smart Contracts**: Solidity-based ERC-20 tokens and liquidity pools integrated with EAS attestations.
- **Frontend**: Modern web application built with Next.js and TailwindCSS.
- **Development Tools**: Monorepo project managed with Turborepo, integrating Foundry as the contract development framework.

### Build & Installation

> luluchill is a monorepo managed using Turborepo. You can find the source code for each package in the `apps` and `packages` directories.

- `apps/web`: Web frontend built with Next.js.
- `apps/docs`: Project documentation website.
- `packages/contracts`: Smart contracts including EASRestrictedToken, EASCertifiedLiquidityPool, etc.

1. Install all dependencies

```bash
pnpm install
```

2. Build all packages

```bash
pnpm build
```

3. Start development environment

```bash
pnpm dev
```

### Core Features

- **Restricted Tokens**: Tokens that only interact with certified liquidity pools or personal wallets, ensuring compliance.
- **Certified Liquidity Pools**: EAS-based liquidity pools controlling user participation eligibility.
- **User Verification**: Users need EAS certification to participate in liquidity pool transactions.
- **Compliance Monitoring**: Auditable and traceable compliance framework through EAS.

### Technical Highlights

- Flexible attestation system based on EAS
- Modular smart contract design
- Scalable monorepo architecture
- Integration of modern frontend frameworks with Web3 technologies

### Deployment Status

The project is currently deployed on HashKey Chain Testnet and Polygon Amoy, supporting the following functions:

- Minting and transferring restricted tokens
- Providing liquidity and trading in certified pools
- User certification and management
- Basic compliance monitoring functions

### Roadmap

- [x] Basic contract development and deployment
- [x] Core frontend interface
- [ ] User certification process optimization
- [ ] Multi-chain deployment support
- [ ] Governance mechanism implementation
- [ ] Audit and compliance report generation

### License

This project is licensed under the MIT License
