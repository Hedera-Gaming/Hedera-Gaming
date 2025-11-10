// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Leaderboard {
    struct PlayerScore {
        address player;
        uint256 highScore;
        uint256 totalKills;
        uint256 bestAccuracy; // Stored as percentage * 100 (e.g., 8500 = 85%)
        uint256 longestSurvival; // In seconds
        uint256 lastUpdated;
        bool exists;
    }

    address public admin;
    address public gameContract; // Only game contract can update scores

    mapping(address => PlayerScore) public playerScores;
    address[] public players;

    event ScoreUpdated(address indexed player, uint256 score, uint256 kills, uint256 accuracy, uint256 survival);
    event GameContractUpdated(address indexed newGameContract);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyGameContract() {
        require(msg.sender == gameContract || msg.sender == admin, "Only game contract");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setGameContract(address _gameContract) external onlyAdmin {
        gameContract = _gameContract;
        emit GameContractUpdated(_gameContract);
    }

    function updateScore(
        address player,
        uint256 score,
        uint256 kills,
        uint256 accuracy,
        uint256 survival
    ) external onlyGameContract {
        require(player != address(0), "Invalid player address");
        require(accuracy <= 10000, "Invalid accuracy"); // Max 100%

        if (!playerScores[player].exists) {
            players.push(player);
            playerScores[player] = PlayerScore({
                player: player,
                highScore: score,
                totalKills: kills,
                bestAccuracy: accuracy,
                longestSurvival: survival,
                lastUpdated: block.timestamp,
                exists: true
            });
        } else {
            PlayerScore storage ps = playerScores[player];

            // Update only if new records
            if (score > ps.highScore) ps.highScore = score;
            if (kills > ps.totalKills) ps.totalKills = kills;
            if (accuracy > ps.bestAccuracy) ps.bestAccuracy = accuracy;
            if (survival > ps.longestSurvival) ps.longestSurvival = survival;

            ps.lastUpdated = block.timestamp;
        }

        emit ScoreUpdated(player, score, kills, accuracy, survival);
    }

    function getPlayerScore(address player) external view returns (PlayerScore memory) {
        require(playerScores[player].exists, "Player not found");
        return playerScores[player];
    }

    function getTopPlayers(uint256 count) external view returns (address[] memory, uint256[] memory) {
        uint256 playerCount = players.length;
        if (count > playerCount) count = playerCount;

        address[] memory sortedPlayers = new address[](playerCount);
        uint256[] memory scores = new uint256[](playerCount);

        for (uint256 i = 0; i < playerCount; i++) {
            sortedPlayers[i] = players[i];
            scores[i] = playerScores[players[i]].highScore;
        }

        // Simple bubble sort (in production, use off-chain sorting)
        for (uint256 i = 0; i < playerCount - 1; i++) {
            for (uint256 j = 0; j < playerCount - i - 1; j++) {
                if (scores[j] < scores[j + 1]) {
                    uint256 tempScore = scores[j];
                    scores[j] = scores[j + 1];
                    scores[j + 1] = tempScore;

                    address tempPlayer = sortedPlayers[j];
                    sortedPlayers[j] = sortedPlayers[j + 1];
                    sortedPlayers[j + 1] = tempPlayer;
                }
            }
        }

        address[] memory topPlayers = new address[](count);
        uint256[] memory topScores = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            topPlayers[i] = sortedPlayers[i];
            topScores[i] = scores[i];
        }

        return (topPlayers, topScores);
    }

    function getTotalPlayers() external view returns (uint256) {
        return players.length;
    }
}
