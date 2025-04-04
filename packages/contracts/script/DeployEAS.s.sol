// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../lib/eas-contracts/contracts/EAS.sol";
import "../lib/eas-contracts/contracts/SchemaRegistry.sol";

contract DeployEASScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 部署 SchemaRegistry
        SchemaRegistry schemaRegistry = new SchemaRegistry();
        console.log("SchemaRegistry deployed at:", address(schemaRegistry));

        // 部署 EAS
        EAS eas = new EAS(address(schemaRegistry));
        console.log("EAS deployed at:", address(eas));

        vm.stopBroadcast();
    }
} 