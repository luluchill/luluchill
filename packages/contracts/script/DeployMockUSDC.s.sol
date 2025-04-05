// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";

/**
 * @title DeployMockUSDC
 * @dev Script to deploy MockUSDC
 */
contract DeployMockUSDC is Script {
    function run() public {
        // Get private key from environment variables
        uint256 privateKey = vm.envUint("INSTITUTION_PRIVATE_KEY");
        address deployer = vm.addr(privateKey);
        console.log("Deployer address:", deployer);
        
        // Set initial supply to 1,000,000 USDC (with 6 decimals, so 1,000,000 * 10^6)
        uint256 initialSupply = 1_000_000 * 10**6;
        
        // Start broadcasting transactions
        vm.startBroadcast(privateKey);
        
        // Deploy contract
        MockUSDC usdc = new MockUSDC(initialSupply);
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Output contract address
        console.log("MockUSDC deployed to:", address(usdc));
        console.log("Initial supply:", initialSupply, "units (1,000,000 USDC)");
    }
} 