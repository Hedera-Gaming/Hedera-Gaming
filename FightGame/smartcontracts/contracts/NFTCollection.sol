// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NFTCollection {
    struct Achievement {
        uint256 id;
        string name;
        string description;
        string rarity; // Common, Rare, Epic, Legendary, Mythic
        uint256 requirement;
        string achievementType; // score, kills, accuracy, time, combo
    }

    struct NFT {
        uint256 tokenId;
        uint256 achievementId;
        address owner;
        string metadataURI;
        uint256 mintedAt;
        bool exists;
    }

    address public admin;
    uint256 public nextTokenId;
    uint256 public royaltyPercentage = 5; // 5% royalty

    mapping(uint256 => NFT) public nfts;
    mapping(address => uint256[]) public ownerTokens;
    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public hasEarnedAchievement;
    
    // Approval mappings (ERC-721 standard)
    mapping(uint256 => address) private tokenApprovals; // tokenId => approved address
    mapping(address => mapping(address => bool)) private operatorApprovals; // owner => operator => approved

    event NFTMinted(uint256 indexed tokenId, address indexed owner, uint256 achievementId);
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event AchievementCreated(uint256 indexed achievementId, string name);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier onlyOwner(uint256 tokenId) {
        require(nfts[tokenId].owner == msg.sender, "Not the owner");
        _;
    }

    constructor() {
        admin = msg.sender;
        nextTokenId = 1;
        _initializeAchievements();
    }

    function _initializeAchievements() internal {
        achievements[1] = Achievement({ id: 1, name: "Galactic Commander", description: "Highest global score of the match", rarity: "Legendary", requirement: 100000, achievementType: "score" });
        achievements[2] = Achievement({ id: 2, name: "Stellar Destroyer", description: "Highest total number of kills", rarity: "Legendary", requirement: 50, achievementType: "kills" });
        achievements[3] = Achievement({ id: 3, name: "Photonic Blade", description: "Best accuracy >= 85%", rarity: "Epic", requirement: 85, achievementType: "accuracy" });
        achievements[4] = Achievement({ id: 4, name: "Time Master", description: "Longest survival duration", rarity: "Epic", requirement: 900, achievementType: "time" });
        achievements[5] = Achievement({ id: 5, name: "Star Champion", description: "Score above 90% of best player", rarity: "Epic", requirement: 50000, achievementType: "score" });
        achievements[6] = Achievement({ id: 6, name: "Solar Flame", description: "Highest kills/minute ratio", rarity: "Rare", requirement: 10, achievementType: "kills" });
        achievements[7] = Achievement({ id: 7, name: "Orbital Sniper", description: "Precision > 95% over 50 shots", rarity: "Epic", requirement: 95, achievementType: "accuracy" });
        achievements[8] = Achievement({ id: 8, name: "Void Survivor", description: "Survival > 10 min without death", rarity: "Rare", requirement: 600, achievementType: "time" });
        achievements[9] = Achievement({ id: 9, name: "Stellar Prodigy", description: "High score + precision > 80%", rarity: "Epic", requirement: 30000, achievementType: "combo" });
        achievements[10] = Achievement({ id: 10, name: "Ring Legend", description: "Master all stats", rarity: "Mythic", requirement: 1, achievementType: "combo" });
    }

    function mintNFT(
        address player,
        uint256 achievementId,
        string memory metadataURI,
        bytes memory signature
    ) external onlyAdmin returns (uint256) {
        require(achievementId >= 1 && achievementId <= 10, "Invalid achievement");
        require(!hasEarnedAchievement[player][achievementId], "Already earned");
        require(signature.length > 0, "Invalid signature");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        nfts[tokenId] = NFT({
            tokenId: tokenId,
            achievementId: achievementId,
            owner: player,
            metadataURI: metadataURI,
            mintedAt: block.timestamp,
            exists: true
        });

        ownerTokens[player].push(tokenId);
        hasEarnedAchievement[player][achievementId] = true;

        emit NFTMinted(tokenId, player, achievementId);

        return tokenId;
    }

    function transferNFT(uint256 tokenId, address to) external {
        require(nfts[tokenId].exists, "NFT does not exist");
        require(to != address(0), "Invalid address");
        
        address from = nfts[tokenId].owner;
        
        // Check if caller is authorized (owner, approved, or operator)
        require(
            msg.sender == from || 
            msg.sender == tokenApprovals[tokenId] || 
            operatorApprovals[from][msg.sender],
            "Not authorized to transfer"
        );

        // Clear approvals
        delete tokenApprovals[tokenId];
        
        nfts[tokenId].owner = to;

        _removeTokenFromOwner(from, tokenId);
        ownerTokens[to].push(tokenId);

        emit NFTTransferred(tokenId, from, to);
    }

    function _removeTokenFromOwner(address ownerAddr, uint256 tokenId) internal {
        uint256[] storage tokens = ownerTokens[ownerAddr];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    function getOwnerTokens(address ownerAddr) external view returns (uint256[] memory) {
        return ownerTokens[ownerAddr];
    }

    // changed to return tuple to match INFTCollection interface
    function getNFT(uint256 tokenId) external view returns (
        uint256 id,
        uint256 achievementId,
        address ownerAddr,
        string memory metadataURI,
        uint256 mintedAt,
        bool exists
    ) {
        require(nfts[tokenId].exists, "NFT does not exist");
        NFT memory nft = nfts[tokenId];
        return (nft.tokenId, nft.achievementId, nft.owner, nft.metadataURI, nft.mintedAt, nft.exists);
    }

    function getAchievement(uint256 achievementId) external view returns (Achievement memory) {
        return achievements[achievementId];
    }

    function setRoyaltyPercentage(uint256 percentage) external onlyAdmin {
        require(percentage <= 10, "Royalty too high");
        royaltyPercentage = percentage;
    }

    // ========== APPROVAL FUNCTIONS (ERC-721 Standard) ==========

    /**
     * @dev Approve a specific address to transfer a specific token
     * @param to Address to approve
     * @param tokenId Token ID to approve
     */
    function approve(address to, uint256 tokenId) external {
        address owner = nfts[tokenId].owner;
        require(msg.sender == owner || operatorApprovals[owner][msg.sender], "Not authorized");
        require(to != owner, "Cannot approve owner");
        
        tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
     * @dev Approve or remove an operator for all tokens owned by msg.sender
     * @param operator Address to set as operator
     * @param approved True to approve, false to revoke
     */
    function setApprovalForAll(address operator, bool approved) external {
        require(msg.sender != operator, "Cannot set approval for self");
        operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev Get the approved address for a specific token
     * @param tokenId Token ID to query
     * @return Address approved for this token
     */
    function getApproved(uint256 tokenId) external view returns (address) {
        require(nfts[tokenId].exists, "NFT does not exist");
        return tokenApprovals[tokenId];
    }

    /**
     * @dev Check if an operator is approved for all tokens of an owner
     * @param owner Owner address
     * @param operator Operator address
     * @return True if operator is approved
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return operatorApprovals[owner][operator];
    }
}
