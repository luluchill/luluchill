// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev A mock USDC ERC-20 token
 * Standard USDC uses 6 decimals rather than the default 18 for ERC-20
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private _decimals = 6;
    
    /**
     * @dev Constructor
     * @param initialSupply Initial supply (in smallest units)
     */
    constructor(uint256 initialSupply) ERC20("USD Coin", "USDC") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Override decimals function
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint new tokens
     * @param to Recipient address
     * @param amount Amount (in smallest units)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
} 