// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../lib/eas-contracts/contracts/EAS.sol";
import "../lib/eas-contracts/contracts/SchemaRegistry.sol";
import "../lib/eas-contracts/contracts/Indexer.sol";

contract DeployEASScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy SchemaRegistry
        SchemaRegistry schemaRegistry = new SchemaRegistry();
        console.log("SchemaRegistry deployed at:", address(schemaRegistry));

        // Deploy EAS
        EAS eas = new EAS(schemaRegistry);
        console.log("EAS deployed at:", address(eas));

        // Deploy Indexer
        Indexer indexer = new Indexer(eas);
        console.log("Indexer deployed at:", address(indexer));

        // Print contract address summary for easy reference
        console.log("\n--- EAS deploy summary ---");
        console.log("SchemaRegistry:", address(schemaRegistry));
        console.log("EAS:", address(eas));
        console.log("Indexer:", address(indexer));
        console.log("--------------------\n");

        vm.stopBroadcast();
    }
} 