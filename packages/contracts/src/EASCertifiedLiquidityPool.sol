// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../lib/eas-contracts/contracts/IEAS.sol";
import "./EASRestrictedToken.sol";

/**
 * @title EASCertifiedLiquidityPool
 * @dev A liquidity pool that can only be used by users holding specific EAS attestations
 * This pool supports exchange between EASRestrictedToken and another token
 */
contract EASCertifiedLiquidityPool is Ownable {
    using SafeERC20 for IERC20;
    
    // Tokens
    EASRestrictedToken public restrictedToken; // Restricted token
    IERC20 public pairedToken; // Paired token
    
    // EAS attestation related
    IEAS public eas;
    bytes32 public userSchemaUID; // Schema UID for user attestations
    mapping(address => bool) public userCertified; // Track validated user addresses
    
    // Pool parameters
    uint256 public constant PRECISION = 1e18;
    
    // Events
    event UserCertified(address indexed user, bytes32 attestationUID);
    event TokensAdded(address indexed provider, uint256 restrictedAmount, uint256 pairedAmount);
    event TokensRemoved(address indexed provider, uint256 restrictedAmount, uint256 pairedAmount);
    event TokensSwapped(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event SchemaUIDUpdated(bytes32 oldSchemaUID, bytes32 newSchemaUID);
    
    /**
     * @dev Constructor
     * @param _restrictedToken Address of the restricted ERC-20 token
     * @param _pairedToken Address of the paired ERC-20 token
     * @param _eas EAS contract address
     * @param _userSchemaUID Schema UID for user attestations
     */
    constructor(
        address _restrictedToken,
        address _pairedToken,
        address _eas,
        bytes32 _userSchemaUID
    ) Ownable(msg.sender) {
        restrictedToken = EASRestrictedToken(_restrictedToken);
        pairedToken = IERC20(_pairedToken);
        eas = IEAS(_eas);
        userSchemaUID = _userSchemaUID;
    }
    
    /**
     * @dev Set new user attestation schema UID
     * @param _userSchemaUID New user attestation schema UID
     */
    function setUserSchemaUID(bytes32 _userSchemaUID) external onlyOwner {
        bytes32 oldSchemaUID = userSchemaUID;
        userSchemaUID = _userSchemaUID;
        emit SchemaUIDUpdated(oldSchemaUID, _userSchemaUID);
    }
    
    /**
     * @dev Manually validate a user address (admin function)
     * @param user Address to validate
     */
    function manuallyValidateUser(address user) external onlyOwner {
        userCertified[user] = true;
        emit UserCertified(user, bytes32(0));
    }
    
    /**
     * @dev Revoke user certification (admin function)
     * @param user Address to revoke
     */
    function revokeUserValidation(address user) external onlyOwner {
        userCertified[user] = false;
    }
    
    /**
     * @dev User self-certification by providing EAS attestation
     * @param attestationUID Attestation UID
     */
    function certifyUser(bytes32 attestationUID) external {
        Attestation memory attestation = eas.getAttestation(attestationUID);
        
        // Validate attestation validity
        require(attestation.schema == userSchemaUID, "Invalid Schema");
        require(attestation.recipient == msg.sender, "Attestation does not belong to caller");
        require(attestation.revocationTime == 0, "Attestation has been revoked");
        
        // Mark user as certified
        userCertified[msg.sender] = true;
        
        emit UserCertified(msg.sender, attestationUID);
    }
    
    /**
     * @dev Check if user is certified
     */
    modifier onlyCertifiedUser() {
        require(userCertified[msg.sender], "User not certified");
        _;
    }
    
    /**
     * @dev Check if user is certified or owner
     */
    modifier onlyCertifiedUserOrOwner() {
        require(userCertified[msg.sender] || owner() == msg.sender, "User not certified and not owner");
        _;
    }
    
    /**
     * @dev Add liquidity
     * @param restrictedAmount Amount of restricted tokens
     * @param pairedAmount Amount of paired tokens
     */
    function addLiquidity(uint256 restrictedAmount, uint256 pairedAmount) external onlyCertifiedUserOrOwner {
        require(restrictedAmount > 0 && pairedAmount > 0, "Amounts cannot be zero");
        
        // Transfer tokens in
        restrictedToken.transferFrom(msg.sender, address(this), restrictedAmount);
        pairedToken.safeTransferFrom(msg.sender, address(this), pairedAmount);
        
        emit TokensAdded(msg.sender, restrictedAmount, pairedAmount);
    }
    
    /**
     * @dev Swap tokens
     * @param tokenIn Input token address
     * @param amountIn Input amount
     * @return amountOut Output amount
     */
    function swap(address tokenIn, uint256 amountIn) external onlyCertifiedUser returns (uint256 amountOut) {
        require(amountIn > 0, "Input amount must be greater than zero");
        require(
            tokenIn == address(restrictedToken) || tokenIn == address(pairedToken),
            "Unsupported token"
        );
        
        // Determine input and output tokens
        IERC20 inputToken;
        IERC20 outputToken;
        
        if (tokenIn == address(restrictedToken)) {
            inputToken = restrictedToken;
            outputToken = pairedToken;
        } else {
            inputToken = pairedToken;
            outputToken = restrictedToken;
        }
        
        // Calculate output amount (simplified constant product formula)
        uint256 inputReserve = inputToken.balanceOf(address(this));
        uint256 outputReserve = outputToken.balanceOf(address(this));
        
        // Calculate output (constant product formula)
        amountOut = amountIn * outputReserve / (inputReserve + amountIn);
        
        require(amountOut > 0, "Output amount too small");
        require(amountOut <= outputReserve, "Insufficient liquidity");
        
        // Transfer tokens in
        inputToken.safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Transfer tokens out
        outputToken.safeTransfer(msg.sender, amountOut);
        
        emit TokensSwapped(msg.sender, address(inputToken), address(outputToken), amountIn, amountOut);
        
        return amountOut;
    }
    
    /**
     * @dev Return swap estimate
     * @param tokenIn Input token address
     * @param amountIn Input amount
     * @return amountOut Estimated output amount
     */
    function getSwapEstimate(address tokenIn, uint256 amountIn) external view returns (uint256 amountOut) {
        require(
            tokenIn == address(restrictedToken) || tokenIn == address(pairedToken),
            "Unsupported token"
        );
        
        // Determine input and output tokens
        IERC20 inputToken;
        IERC20 outputToken;
        
        if (tokenIn == address(restrictedToken)) {
            inputToken = restrictedToken;
            outputToken = pairedToken;
        } else {
            inputToken = pairedToken;
            outputToken = restrictedToken;
        }
        
        // Calculate output amount
        uint256 inputReserve = inputToken.balanceOf(address(this));
        uint256 outputReserve = outputToken.balanceOf(address(this));
        
        // Calculate output
        amountOut = amountIn * outputReserve / (inputReserve + amountIn);
        
        return amountOut;
    }
    
    /**
     * @dev Check if user holds a valid EAS attestation
     * @param user User address
     * @return Whether the user is certified
     */
    function isUserCertified(address user) external view returns (bool) {
        return userCertified[user];
    }
    
    /**
     * @dev Return pool status
     * @return restrictedBalance Restricted token balance
     * @return pairedBalance Paired token balance
     */
    function getPoolInfo() external view returns (
        uint256 restrictedBalance,
        uint256 pairedBalance
    ) {
        restrictedBalance = restrictedToken.balanceOf(address(this));
        pairedBalance = pairedToken.balanceOf(address(this));
        
        return (restrictedBalance, pairedBalance);
    }
} 