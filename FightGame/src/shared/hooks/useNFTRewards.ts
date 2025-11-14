import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { NFTContract, VerifierContract } from '../types/contracts';

// Contract ABIs
const NFTCollectionABI = {
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "achievementId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "AchievementCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "achievementId",
          "type": "uint256"
        }
      ],
      "name": "NFTMinted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "achievementId",
          "type": "uint256"
        }
      ],
      "name": "getAchievement",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "rarity",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "requirement",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "achievementType",
              "type": "string"
            }
          ],
          "internalType": "struct NFTCollection.Achievement",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
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
      "name": "getNFT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "achievementId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "ownerAddr",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "metadataURI",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "mintedAt",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "ownerAddr",
          "type": "address"
        }
      ],
      "name": "getOwnerTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

const AchievementVerifierABI = {
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "achievementId",
          "type": "uint256"
        }
      ],
      "name": "AchievementClaimed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "achievementId",
          "type": "uint256"
        }
      ],
      "name": "checkAchievement",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "score",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "kills",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "accuracy",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timeSurvived",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "verifySession",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
};

const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
const VERIFIER_CONTRACT_ADDRESS = import.meta.env.VITE_VERIFIER_CONTRACT_ADDRESS;

export interface Achievement {
  id: number;
  name: string;
  description: string;
  rarity: string;
  requirement: number;
  achievementType: string;
}

export interface NFT {
  tokenId: string;
  achievementId: string;
  achievement: Achievement;
  metadataURI: string;
}

function convertBigIntToNumber(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Number(value);
}

import { HederaWallet, GameStats } from '../types/wallet';

// Accept a flexible wallet shape here because the app supports multiple
// wallet types (MetaMask, HashPack, etc). The hook does runtime checks for
// `wallet?.signer` before attempting contract interactions, so a loose type
// prevents TypeScript errors when passing the lightweight `WalletInfo` used
// by the UI while still preserving safety at runtime.
export const useNFTRewards = (wallet: any | null) => {
  const [nftContract, setNFTContract] = useState<NFTContract | null>(null);
  const [verifierContract, setVerifierContract] = useState<VerifierContract | null>(null);
  const [playerNFTs, setPlayerNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!wallet?.signer) return;

    const initContracts = async () => {
      try {
        const provider = wallet.signer.provider;
        
        const nftContractInstance = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          NFTCollectionABI.abi,
          provider
        ).connect(wallet.signer) as NFTContract;
        
        const verifierContractInstance = new ethers.Contract(
          VERIFIER_CONTRACT_ADDRESS,
          AchievementVerifierABI.abi,
          provider
        ).connect(wallet.signer) as VerifierContract;

        setNFTContract(nftContractInstance);
        setVerifierContract(verifierContractInstance);

        // Listen for NFT minting events
        nftContractInstance.on('NFTMinted', async (tokenId, owner, achievementId) => {
          if (owner.toLowerCase() === wallet.address.toLowerCase()) {
            await refreshPlayerNFTs();
            const achievement = await nftContractInstance.getAchievement(achievementId);
            toast.success(`🎉 Nouveau NFT obtenu : ${achievement.name}!`);
          }
        });

        await refreshPlayerNFTs();
      } catch (error) {
        console.error('Error initializing contracts:', error);
        toast.error('Erreur de connexion aux smart contracts Hedera');
      } finally {
        setIsLoading(false);
      }
    };

    initContracts();

    return () => {
      if (nftContract) {
        nftContract.removeAllListeners('NFTMinted');
      }
    };
  }, [wallet?.signer]);

  const refreshPlayerNFTs = async () => {
    if (!nftContract || !wallet?.address) return;

    try {
      setIsLoading(true);
      const tokens = await nftContract.getOwnerTokens(wallet.address);
      const nfts = await Promise.all(
        tokens.map(async (tokenId: bigint) => {
          const nft = await nftContract.getNFT(tokenId);
          const achievement = await nftContract.getAchievement(nft.achievementId);
          return {
            tokenId: tokenId.toString(),
            achievementId: nft.achievementId.toString(),
            achievement: {
              id: convertBigIntToNumber(achievement.id),
              name: achievement.name,
              description: achievement.description,
              rarity: achievement.rarity,
              requirement: convertBigIntToNumber(achievement.requirement),
              achievementType: achievement.achievementType
            },
            metadataURI: nft.metadataURI
          };
        })
      );
      setPlayerNFTs(nfts);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      toast.error('Erreur lors de la récupération des NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndMintNFT = async (
    score: number,
    kills: number,
    accuracy: number,
    timeSurvived: number
  ) => {
    if (!verifierContract || !nftContract || !wallet?.address) return;

    try {
      // Verify game session
        const dataHash = ethers.solidityPackedKeccak256(
          ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
          [wallet.address, score, kills, accuracy, timeSurvived]
        );
        
        const signature = await wallet.signer.signMessage(
          ethers.getBytes(dataHash)
        );      const sessionHash = await verifierContract.verifySession(
        wallet.address,
        score,
        kills,
        Math.floor(accuracy * 100), // Convert to basis points (0-10000)
        timeSurvived,
        signature
      );

      // Check achievements and mint NFTs
      for (let achievementId = 1; achievementId <= 10; achievementId++) {
        if (await verifierContract.checkAchievement(wallet.address, achievementId)) {
          // Check player tokens to see if they already have this achievement
          const tokens = await nftContract.getOwnerTokens(wallet.address);
          const hasAchievement = await Promise.all(
            tokens.map(async tokenId => {
              const nft = await nftContract.getNFT(tokenId);
              return nft.achievementId === BigInt(achievementId);
            })
          );
          
          if (!hasAchievement.includes(true)) {
            // Generate metadata URI for the NFT
            const metadataURI = `ipfs://Qm.../${achievementId}.json`; // Replace with your IPFS metadata

            // Mint the NFT
            const tx = await nftContract.mintNFT(
              wallet.address,
              achievementId,
              metadataURI,
              signature
            );
            await tx.wait();
          }
        }
      }

      await refreshPlayerNFTs();
    } catch (error) {
      console.error('Error verifying and minting NFT:', error);
      toast.error('Erreur lors de la création du NFT');
    }
  };

  return {
    playerNFTs,
    isLoading,
    verifyAndMintNFT,
    refreshPlayerNFTs
  };
};