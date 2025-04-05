// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../lib/eas-contracts/contracts/IEAS.sol";
import "../src/EASRestrictedToken.sol";
import "../src/EASCertifiedLiquidityPool.sol";
import "../src/MockUSDC.sol";

/**
 * @title DeployEASToken
 * @dev Script to deploy EAS restricted token and related contracts
 */
contract DeployEASTokenOnHashyKey is Script {
    // HashyKey EAS contract address
    address public constant EAS_CONTRACT = 0xAED1888Ab6691e86463656C586A3A4F77977C39d;

    // Deployed MockUSDC contract address
    address public constant MOCK_USDC = 0xe6FEe3091C72E5D63b943c0E813154768d187476;
    
    function run() public {
        uint256 institutionPrivateKey = vm.envUint("INSTITUTION_PRIVATE_KEY");
        address deployer = vm.addr(institutionPrivateKey);
        console.log("Deployer address:", deployer);
        
        vm.startBroadcast(institutionPrivateKey);
        
        // In actual deployment, you need to call SchemaRegistry.register first to get the schema UID
        // Schema UID for liquidity pool certification
        bytes32 poolSchemaUID = 0x3dbb0e61fa110b0c696c238bb53d64de1a18a8303fb135c0724bae15adb0130d;  // Need to obtain through SchemaRegistry registration
        
        // Schema UID for user certification
        bytes32 userSchemaUID = 0x66ceb27660877e18c3ed91f55b7a5aa9ba4d54aeb75c8a94a6df90aca219c4ca;  // Need to obtain through SchemaRegistry registration
        
        // 1. Deploy restricted ERC-20 token
        EASRestrictedToken restrictedToken = new EASRestrictedToken(
            "Noluluchill RWA",
            "NLLCRWA",
            EAS_CONTRACT,
            poolSchemaUID,
            1_000_000 * 10**18  // Initial supply: 1,000,000 tokens
        );
        
        // 2. Deploy liquidity pool
        EASCertifiedLiquidityPool liquidityPool = new EASCertifiedLiquidityPool(
            address(restrictedToken),
            MOCK_USDC,
            EAS_CONTRACT,
            userSchemaUID  // Using user certification schema UID
        );
        
        // 4. Mint some paired tokens for the liquidity pool
        MockUSDC mockUsdc = MockUSDC(MOCK_USDC);
        restrictedToken.manuallyValidatePool(address(liquidityPool));
        
        // 5. Manually add some initial liquidity to the pool
        uint256 initialLiquidity = 100_000 * 10**18; // 100,000 tokens
        restrictedToken.approve(address(liquidityPool), initialLiquidity);

        mockUsdc.approve(address(liquidityPool), 100_000 * 10**6); // 100,000 USDC
        liquidityPool.addLiquidity(initialLiquidity, 100_000 * 10**6);
        
        // Output deployed contract addresses
        console.log("Deployed contracts:");
        console.log("Mock USDC Address:", MOCK_USDC);
        console.log("Restricted Token:", address(restrictedToken));
        console.log("Liquidity Pool:", address(liquidityPool));
        
        vm.stopBroadcast();
    }
} 