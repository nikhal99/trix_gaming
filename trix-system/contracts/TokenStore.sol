// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./GameToken.sol";

contract TokenStore is Pausable, ReentrancyGuard, AccessControl {
    IERC20 public immutable usdt;
    GameToken public immutable gameToken;
    uint256 public constant USDT_TO_GT_RATE = 1; // 1 USDT = 1 GT

    constructor(address _usdt, address _gameToken) {
        usdt = IERC20(_usdt);
        gameToken = GameToken(_gameToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Purchase GT with USDT
    function purchase(uint256 usdtAmount) external whenNotPaused nonReentrant returns (uint256) {
        require(usdtAmount > 0, "Amount must be greater than zero");
        
        // Transfer USDT from buyer to this contract
        require(usdt.transferFrom(msg.sender, address(this), usdtAmount), "USDT transfer failed");

        // Calculate GT amount (1:1 rate)
        uint256 gtAmount = usdtAmount * USDT_TO_GT_RATE;

        // Mint GT to buyer
        gameToken.mint(msg.sender, gtAmount);

        emit Purchased(msg.sender, usdtAmount, gtAmount);
        return gtAmount;
    }

    // Pause contract
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    // Unpause contract
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    event Purchased(address indexed buyer, uint256 usdtAmount, uint256 gtAmount);
}