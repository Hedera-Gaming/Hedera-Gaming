// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface INFTCollection {
    function transferNFT(uint256 tokenId, address to) external;
    function getNFT(uint256 _tokenId) external view returns (
        uint256 id,
        uint256 achievementId,
        address owner,
        string memory metadataURI,
        uint256 mintedAt,
        bool exists
    );
    function royaltyPercentage() external view returns (uint256);
}

contract Marketplace {
    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
        uint256 listedAt;
    }

    address public nftContract;
    address public admin;
    uint256 public nextListingId;
    uint256 public platformFee = 2; // 2% platform fee

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => uint256) public tokenToListing; // tokenId => listingId

    event Listed(uint256 indexed listingId, uint256 indexed tokenId, address seller, uint256 price);
    event Sold(uint256 indexed listingId, uint256 indexed tokenId, address buyer, uint256 price);
    event Cancelled(uint256 indexed listingId, uint256 indexed tokenId);

    constructor(address _nftContract) {
        nftContract = _nftContract;
        admin = msg.sender;
        nextListingId = 1;
    }

    function createListing(uint256 tokenId, uint256 price) external returns (uint256) {
        require(price > 0, "Price must be > 0");

        // Verify ownership using the interface return tuple
        (uint256 id, uint256 achievementId, address owner, string memory metadataURI, uint256 mintedAt, bool exists) = INFTCollection(nftContract).getNFT(tokenId);
        require(exists, "NFT does not exist");
        require(owner == msg.sender, "Not the owner");
        require(tokenToListing[tokenId] == 0, "Already listed");

        uint256 listingId = nextListingId;
        nextListingId++;

        listings[listingId] = Listing({
            listingId: listingId,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true,
            listedAt: block.timestamp
        });

        tokenToListing[tokenId] = listingId;

        emit Listed(listingId, tokenId, msg.sender, price);

        return listingId;
    }

    function buyNFT(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.active = false;
        tokenToListing[listing.tokenId] = 0;

        // Calculate fees
        uint256 royalty = INFTCollection(nftContract).royaltyPercentage();
        uint256 royaltyAmount = (listing.price * royalty) / 100;
        uint256 platformFeeAmount = (listing.price * platformFee) / 100;
        uint256 sellerAmount = listing.price - royaltyAmount - platformFeeAmount;

        // Transfer payments
        payable(listing.seller).transfer(sellerAmount);
        payable(admin).transfer(royaltyAmount + platformFeeAmount);

        // Transfer NFT (note: This requires approval mechanism in production)
        // For simplicity, we assume the seller has approved the marketplace
        INFTCollection(nftContract).transferNFT(listing.tokenId, msg.sender);

        emit Sold(listingId, listing.tokenId, msg.sender, listing.price);

        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        listing.active = false;
        tokenToListing[listing.tokenId] = 0;

        emit Cancelled(listingId, listing.tokenId);
    }

    function getActiveListing(uint256 tokenId) external view returns (Listing memory) {
        uint256 listingId = tokenToListing[tokenId];
        require(listingId != 0, "No active listing");
        return listings[listingId];
    }
}
