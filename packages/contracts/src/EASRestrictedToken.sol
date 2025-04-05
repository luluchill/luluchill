// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../lib/eas-contracts/contracts/IEAS.sol";

/**
 * @title EASRestrictedToken
 * @dev This is a restricted ERC-20 token that only allows interaction with EAS-certified liquidity pools
 * Uses the EAS attestation service to verify liquidity pool eligibility
 */
contract EASRestrictedToken is ERC20, Ownable {
    IEAS public eas; // EAS contract interface
    bytes32 public validPoolSchemaUID; // Schema UID for liquidity pool certification
    
    // Track certified liquidity pool addresses
    mapping(address => bool) public isValidatedPool;
    
    // Events
    event PoolValidated(address indexed poolAddress, bytes32 attestationUID);
    event PoolValidationRevoked(address indexed poolAddress);
    event SchemaUpdated(bytes32 oldSchema, bytes32 newSchema);
    event EASAddressUpdated(address oldEAS, address newEAS);
    
    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     * @param easAddress EAS contract address
     * @param schemaUID Schema UID for liquidity pool certification
     * @param initialSupply Initial supply
     */
    constructor(
        string memory name,
        string memory symbol,
        address easAddress,
        bytes32 schemaUID,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        eas = IEAS(easAddress);
        validPoolSchemaUID = schemaUID;
        
        // Mint initial supply to deployer
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Set new EAS contract address
     * @param newEASAddress New EAS contract address
     */
    function setEASAddress(address newEASAddress) external onlyOwner {
        address oldEAS = address(eas);
        eas = IEAS(newEASAddress);
        emit EASAddressUpdated(oldEAS, newEASAddress);
    }
    
    /**
     * @dev Set new schema UID
     * @param newSchemaUID New schema UID
     */
    function setSchemaUID(bytes32 newSchemaUID) external onlyOwner {
        bytes32 oldSchema = validPoolSchemaUID;
        validPoolSchemaUID = newSchemaUID;
        emit SchemaUpdated(oldSchema, newSchemaUID);
    }
    
    /**
     * @dev Manually validate a liquidity pool address (emergency mechanism)
     * @param poolAddress Liquidity pool address
     */
    function manuallyValidatePool(address poolAddress) external onlyOwner {
        isValidatedPool[poolAddress] = true;
        emit PoolValidated(poolAddress, bytes32(0));
    }
    
    /**
     * @dev Revoke validation for a liquidity pool
     * @param poolAddress Liquidity pool address
     */
    function revokePoolValidation(address poolAddress) external onlyOwner {
        isValidatedPool[poolAddress] = false;
        emit PoolValidationRevoked(poolAddress);
    }
    
    /**
     * @dev Validate a liquidity pool using EAS attestation
     * @param attestationUID Attestation UID
     */
    function validatePoolByAttestation(bytes32 attestationUID) external {
        Attestation memory attestation = eas.getAttestation(attestationUID);
        
        // Verify attestation validity
        require(attestation.schema == validPoolSchemaUID, "Invalid schema");
        require(attestation.revocationTime == 0, "Attestation has been revoked");
        
        // Get liquidity pool address (assuming recipient is the liquidity pool address)
        address poolAddress = attestation.recipient;
        
        // Mark as validated
        isValidatedPool[poolAddress] = true;
        
        emit PoolValidated(poolAddress, attestationUID);
    }
    
    /**
     * @dev Override transfer method, add validation for recipient
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        // Allow transfers if recipient is EOA (not a contract) or a validated liquidity pool
        if (!_isContract(to) || isValidatedPool[to]) {
            return super.transfer(to, amount);
        }
        
        revert("Recipient is not a validated liquidity pool");
    }
    
    /**
     * @dev Override transferFrom method, add validation for recipient
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        // Allow transfers if recipient is EOA (not a contract) or a validated liquidity pool
        if (!_isContract(to) || isValidatedPool[to]) {
            return super.transferFrom(from, to, amount);
        }
        
        revert("Recipient is not a validated liquidity pool");
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Check if address is a contract
     * @param addr Address to check
     * @return true if it's a contract, false otherwise
     */
    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
} 