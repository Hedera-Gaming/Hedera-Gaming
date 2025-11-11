import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY;

async function fetchNFTMetadata(tokenId: string | number) {
  const tokenIdStr = tokenId.toString();
  try {
    // First get the token URI from the NFT contract
    const response = await fetch(`${IPFS_GATEWAY}/${tokenIdStr}`);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    
    const metadata = await response.json();
    return {
      name: metadata.name || `Space NFT #${tokenId}`,
      description: metadata.description || 'A unique space-themed NFT',
      rarity: metadata.attributes?.find((attr: any) => attr.trait_type === 'Rarity')?.value || 'Common',
      image: metadata.image?.replace('ipfs://', IPFS_GATEWAY) || '🎮'
    };
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return {
      name: `Space NFT #${tokenIdStr}`,
      description: 'A unique space-themed NFT',
      rarity: 'Common',
      image: '🎮'
    };
  }
}

const MarketplaceABI = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_nftContract",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Cancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "Listed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "Sold",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "buyNFT",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "cancelListing",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "createListing",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getActiveListing",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "listedAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct Marketplace.Listing",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

export interface NFTListing {
  listingId: string;
  tokenId: string;
  seller: string;
  price: string;
  active: boolean;
  listedAt: number;
  nft?: {
    name: string;
    description: string;
    rarity: string;
    image: string;
  };
}

const MARKETPLACE_CONTRACT_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;

export const useMarketplace = (wallet: any) => {
  const [marketplaceContract, setMarketplaceContract] = useState<ethers.Contract | null>(null);
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!wallet?.signer) return;

    const initContract = async () => {
      try {
        const contract = new ethers.Contract(
          MARKETPLACE_CONTRACT_ADDRESS,
          MarketplaceABI.abi,
          wallet.signer
        );

        setMarketplaceContract(contract);

        // Listen for marketplace events
        contract.on('Listed', async (listingId, tokenId, seller, price) => {
          await refreshListings();
          toast.success('New NFT listed!');
        });

        contract.on('Sold', async (listingId, tokenId, buyer, price) => {
          await refreshListings();
          if (buyer.toLowerCase() === wallet.address.toLowerCase()) {
            toast.success('Successfully purchased NFT!');
          }
        });

        contract.on('Cancelled', async (listingId, tokenId) => {
          await refreshListings();
          toast.info('Listing cancelled');
        });

        await refreshListings();
      } catch (error) {
        console.error('Error initializing marketplace:', error);
        toast.error('Failed to connect to marketplace');
      }
    };

    initContract();

    return () => {
      if (marketplaceContract) {
        marketplaceContract.removeAllListeners();
      }
    };
  }, [wallet?.signer]);

  const refreshListings = async () => {
    if (!marketplaceContract) return;

    try {
      setIsLoading(true);
      // For this example, we'll just get active listings for tokens 1-100
      // In production, you'd want to get this list from an indexer or event logs
      const activeListings: NFTListing[] = [];
      
      for (let tokenId = 1; tokenId <= 100; tokenId++) {
        try {
          const listing = await marketplaceContract.getActiveListing(tokenId);
          if (listing.active) {
            activeListings.push({
              listingId: listing.listingId.toString(),
              tokenId: listing.tokenId.toString(),
              seller: listing.seller,
              price: ethers.formatEther(listing.price),
              active: listing.active,
              listedAt: Number(listing.listedAt),
              // Fetch NFT metadata from IPFS
              nft: await fetchNFTMetadata(tokenId)
            });
          }
        } catch (error) {
          // Skip if no active listing for this token
          continue;
        }
      }

      setListings(activeListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch marketplace listings');
    } finally {
      setIsLoading(false);
    }
  };

  const listNFT = async (tokenId: string, priceInHbar: string) => {
    if (!marketplaceContract || !wallet?.signer) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      const priceInWei = ethers.parseEther(priceInHbar);
      const tx = await marketplaceContract.createListing(tokenId, priceInWei);
      toast.info('Creating listing...');
      await tx.wait();
      toast.success('NFT listed successfully!');
      await refreshListings();
      return true;
    } catch (error: any) {
      console.error('Error listing NFT:', error);
      
      // Check if error is due to missing approval
      if (error.message?.includes('Not authorized') || error.message?.includes('ERC721: transfer caller is not owner nor approved')) {
        toast.error('Please approve the marketplace first to list your NFTs');
      } else if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to list NFT');
      }
      return false;
    }
  };

  const buyNFT = async (listingId: string, priceInHbar: string) => {
    if (!marketplaceContract || !wallet?.signer) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const priceInWei = ethers.parseEther(priceInHbar);
      const tx = await marketplaceContract.buyNFT(listingId, { value: priceInWei });
      toast.info('Processing purchase...');
      await tx.wait();
      toast.success('NFT purchased successfully!');
      await refreshListings();
    } catch (error) {
      console.error('Error buying NFT:', error);
      toast.error('Failed to buy NFT');
    }
  };

  const cancelListing = async (listingId: string) => {
    if (!marketplaceContract || !wallet?.signer) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const tx = await marketplaceContract.cancelListing(listingId);
      toast.info('Cancelling listing...');
      await tx.wait();
      toast.success('Listing cancelled successfully!');
      await refreshListings();
    } catch (error) {
      console.error('Error cancelling listing:', error);
      toast.error('Failed to cancel listing');
    }
  };

  return {
    listings,
    isLoading,
    listNFT,
    buyNFT,
    cancelListing,
    refreshListings
  };
};