// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./GameToken.sol";

contract PlayGame is Pausable, ReentrancyGuard, AccessControl {
    bytes32 public constant API_GATEWAY_ROLE = keccak256("API_GATEWAY_ROLE");

    GameToken public immutable gameToken;

    struct Match {
        address player1;
        address player2;
        uint256 stakeAmount;
        bool isActive;
    }

    mapping(bytes32 => Match) public matches; // Match ID to Match struct

    constructor(address _gameToken) {
        gameToken = GameToken(_gameToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(API_GATEWAY_ROLE, msg.sender); // API Gateway address should be set
    }

    // Start a match by staking GT
    function startMatch(bytes32 matchId, address player1, address player2, uint256 stakeAmount) 
        external whenNotPaused nonReentrant 
    {
        require(matches[matchId].isActive == false, "Match ID already exists");
        require(stakeAmount > 0, "Stake amount must be greater than zero");
        require(player1 != player2, "Players must be different");
        require(player1 != address(0) && player2 != address(0), "Invalid player address");

        // Transfer stakes from both players
        require(gameToken.transferFrom(player1, address(this), stakeAmount), "Player1 stake transfer failed");
        require(gameToken.transferFrom(player2, address(this), stakeAmount), "Player2 stake transfer failed");

        // Record match
        matches[matchId] = Match({
            player1: player1,
            player2: player2,
            stakeAmount: stakeAmount,
            isActive: true
        });

        emit MatchStarted(matchId, player1, player2, stakeAmount);
    }

    // Submit match result and payout winner
    function submitResult(bytes32 matchId, address winner) 
        external onlyRole(API_GATEWAY_ROLE) whenNotPaused nonReentrant 
    {
        Match memory matchData = matches[matchId];
        require(matchData.isActive, "Match not active or does not exist");
        require(winner == matchData.player1 || winner == matchData.player2, "Invalid winner address");

        // Mark match as inactive
        matches[matchId].isActive = false;

        // Transfer total stake (2 * stakeAmount) to winner
        uint256 totalStake = matchData.stakeAmount * 2;
        require(gameToken.transfer(winner, totalStake), "Payout transfer failed");

        emit MatchEnded(matchId, winner, totalStake);
    }

    // Pause contract
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    // Unpause contract
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    event MatchStarted(bytes32 indexed matchId, address player1, address player2, uint256 stakeAmount);
    event MatchEnded(bytes32 indexed matchId, address winner, uint256 payout);
}