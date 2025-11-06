// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AchievementVerifier {
    struct GameSession {
        address player;
        uint256 score;
        uint256 kills;
        uint256 accuracy; // Percentage * 100
        uint256 timeSurvived; // Seconds
        uint256 timestamp;
        bool verified;
        bytes32 sessionHash;
    }

    address public admin;
    address public gameServer; // Trusted game server

    mapping(bytes32 => GameSession) public sessions; // sessionHash => GameSession
    mapping(address => bytes32[]) public playerSessions; // player => array of sessionHash
    mapping(address => mapping(uint256 => bool)) public achievementClaimed;

    event SessionVerified(bytes32 indexed sessionHash, address indexed player);
    event AchievementClaimed(address indexed player, uint256 achievementId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyGameServer() {
        require(msg.sender == gameServer || msg.sender == admin, "Only game server");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setGameServer(address _gameServer) external onlyAdmin {
        gameServer = _gameServer;
    }

    function verifySession(
        address player,
        uint256 score,
        uint256 kills,
        uint256 accuracy,
        uint256 timeSurvived,
        bytes memory signature
    ) external onlyGameServer returns (bytes32) {
        require(player != address(0), "Invalid player");
        require(accuracy <= 10000, "Invalid accuracy");
        require(signature.length > 0, "Invalid signature");

        // Create unique session hash
        bytes32 sessionHash = keccak256(abi.encodePacked(
            player,
            score,
            kills,
            accuracy,
            timeSurvived,
            block.timestamp,
            block.number
        ));

        sessions[sessionHash] = GameSession({
            player: player,
            score: score,
            kills: kills,
            accuracy: accuracy,
            timeSurvived: timeSurvived,
            timestamp: block.timestamp,
            verified: true,
            sessionHash: sessionHash
        });

        playerSessions[player].push(sessionHash);

        emit SessionVerified(sessionHash, player);

        return sessionHash;
    }

    // changed to public so it can be called internally
    function checkAchievement(address player, uint256 achievementId) public view returns (bool) {
        require(achievementId >= 1 && achievementId <= 10, "Invalid achievement ID");

        bytes32[] memory playerSessionList = playerSessions[player];
        if (playerSessionList.length == 0) return false;

        // Check against achievement requirements
        for (uint256 i = 0; i < playerSessionList.length; i++) {
            bytes32 sessionHash = playerSessionList[i];
            GameSession memory session = sessions[sessionHash];

            if (achievementId == 1) {
                // Galactic Commander: Score >= 100,000
                if (session.score >= 100000) return true;
            } else if (achievementId == 2) {
                // Stellar Destroyer: Kills >= 50
                if (session.kills >= 50) return true;
            } else if (achievementId == 3) {
                // Photonic Blade: Accuracy >= 85%
                if (session.accuracy >= 8500) return true;
            } else if (achievementId == 4) {
                // Time Master: Survival >= 900s (15 min)
                if (session.timeSurvived >= 900) return true;
            } else if (achievementId == 5) {
                // Star Champion: Score >= 50,000
                if (session.score >= 50000) return true;
            } else if (achievementId == 6) {
                // Solar Flame: Kills/min >= 10
                if (session.timeSurvived > 0) {
                    uint256 killsPerMinute = (session.kills * 60) / session.timeSurvived;
                    if (killsPerMinute >= 10) return true;
                }
            } else if (achievementId == 7) {
                // Orbital Sniper: Accuracy >= 95%
                if (session.accuracy >= 9500) return true;
            } else if (achievementId == 8) {
                // Void Survivor: Survival >= 600s (10 min)
                if (session.timeSurvived >= 600) return true;
            } else if (achievementId == 9) {
                // Stellar Prodigy: Score >= 30,000 AND Accuracy >= 80%
                if (session.score >= 30000 && session.accuracy >= 8000) return true;
            } else if (achievementId == 10) {
                // Ring Legend: All stats high
                if (session.score >= 100000 && 
                    session.kills >= 50 && 
                    session.accuracy >= 9000 &&
                    session.timeSurvived >= 600) return true;
            }
        }

        return false;
    }

    function claimAchievement(uint256 achievementId) external returns (bool) {
        require(!achievementClaimed[msg.sender][achievementId], "Already claimed");
        require(checkAchievement(msg.sender, achievementId), "Achievement not earned");

        achievementClaimed[msg.sender][achievementId] = true;
        emit AchievementClaimed(msg.sender, achievementId);

        return true;
    }

    function getPlayerSessions(address player) external view returns (bytes32[] memory) {
        return playerSessions[player];
    }

    function getSession(bytes32 sessionHash) external view returns (GameSession memory) {
        return sessions[sessionHash];
    }
}
