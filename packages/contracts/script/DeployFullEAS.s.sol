// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../lib/eas-contracts/contracts/EAS.sol";
import "../lib/eas-contracts/contracts/SchemaRegistry.sol";
import "../lib/eas-contracts/contracts/Indexer.sol";

contract DeployFullEASScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 部署 SchemaRegistry
        SchemaRegistry schemaRegistry = new SchemaRegistry();
        console.log("SchemaRegistry deployed at:", address(schemaRegistry));

        // 部署 EAS
        EAS eas = new EAS(address(schemaRegistry));
        console.log("EAS deployed at:", address(eas));

        // 部署 Indexer
        Indexer indexer = new Indexer(address(eas));
        console.log("Indexer deployed at:", address(indexer));

        // 印出合約地址摘要，便於記錄
        console.log("\n--- EAS 部署摘要 ---");
        console.log("SchemaRegistry:", address(schemaRegistry));
        console.log("EAS:", address(eas));
        console.log("Indexer:", address(indexer));
        console.log("--------------------\n");

        vm.stopBroadcast();
    }
} 