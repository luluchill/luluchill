## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

# EAS 合約部署指南

本指南說明如何使用 Foundry 將 Ethereum Attestation Service (EAS) 合約部署到任何 EVM 相容的區塊鏈上。

## 前置條件

1. 安裝 [Foundry](https://book.getfoundry.sh/getting-started/installation)
2. 確保已經安裝了所有依賴項：
   ```bash
   pnpm install
   ```

## 更新子模組

首先，更新子模組以獲取 EAS 合約：

```bash
pnpm run contracts:update-submodules
```

## 設置環境變數

部署前需要在專案根目錄創建 `.env` 文件並設置以下內容：

```
PRIVATE_KEY=你的私鑰
RPC_URL=目標區塊鏈的 RPC URL
```

腳本會自動從 `.env` 文件中讀取這些變數。

## 部署合約

EAS 合約有兩種部署選項，可以根據需要選擇：

### 基本 EAS 系統

部署 SchemaRegistry 和 EAS 核心合約：

```bash
pnpm run contracts:deploy-eas-basic
```

### 完整 EAS 系統

部署 SchemaRegistry、EAS 和 Indexer 合約：

```bash
pnpm run contracts:deploy-eas-full
```

## 部署流程說明

部署腳本按照以下順序部署合約：

1. 部署 `SchemaRegistry` 合約
2. 使用 `SchemaRegistry` 地址部署 `EAS` 合約
3. （僅完整版）使用 `EAS` 地址部署 `Indexer` 合約

部署完成後，控制台將輸出所有合約的地址，請記錄這些地址以供後續使用。

## 部署後的驗證

部署完成後，可以使用以下命令驗證合約：

```bash
pnpm run contracts:verify <合約地址> <合約名稱> --chain-id <區塊鏈 ID> --watch
```

例如：

```bash
pnpm run contracts:verify 0x... SchemaRegistry --chain-id 1 --watch
pnpm run contracts:verify 0x... EAS --chain-id 1 --watch
```

## 注意事項

- 確保您有足夠的原生代幣支付部署所需的 gas 費用
- 不同的 EVM 區塊鏈可能有不同的 gas 限制和 gas 價格機制
- 部署私鑰務必妥善保管，避免洩露
- `.env` 文件包含敏感信息，不應該提交到版本控制系統
- 所有指令都在項目根目錄執行，無需進入 `packages/contracts` 目錄 