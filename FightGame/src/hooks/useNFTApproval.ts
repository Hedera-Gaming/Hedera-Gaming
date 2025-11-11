import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_COLLECTION_ADDRESS || import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "0xa22ec388764650316b4b70CabB67f9664Caa69F0";
const MARKETPLACE_CONTRACT_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS || "0xA53b0E6BB86574E3D06e815C385A84A19B7CB9Ff";

console.log('[NFTApproval] NFT Contract:', NFT_CONTRACT_ADDRESS);
console.log('[NFTApproval] Marketplace Contract:', MARKETPLACE_CONTRACT_ADDRESS);

const NFTCollectionABI = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
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
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    }
  ]
};

export const useNFTApproval = (wallet: any) => {
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);
  const [isCheckingApproval, setIsCheckingApproval] = useState(false);

  useEffect(() => {
    if (!wallet?.signer) {
      console.log('[NFTApproval] No signer available, skipping contract initialization');
      return;
    }

    if (!wallet?.address) {
      console.log('[NFTApproval] No wallet address, skipping contract initialization');
      return;
    }

    const initContract = async () => {
      try {
        console.log('[NFTApproval] Initializing NFT contract...');
        console.log('[NFTApproval] Wallet address:', wallet.address);
        console.log('[NFTApproval] Signer available:', !!wallet.signer);

        const contract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          NFTCollectionABI.abi,
          wallet.signer
        );

        // Test if contract is accessible
        try {
          const testCall = await contract.isApprovedForAll(wallet.address, MARKETPLACE_CONTRACT_ADDRESS);
          console.log('[NFTApproval] Contract test call successful. Current approval:', testCall);
        } catch (testError) {
          console.error('[NFTApproval] Contract test call failed:', testError);
          throw new Error('Cannot connect to NFT contract. Contract may not be deployed or network mismatch.');
        }

        setNftContract(contract);
        console.log('[NFTApproval] Contract initialized successfully');

        // Listen for approval events
        contract.on('ApprovalForAll', async (owner, operator, approved) => {
          console.log('[NFTApproval] ApprovalForAll event:', { owner, operator, approved });
          if (owner.toLowerCase() === wallet.address.toLowerCase() &&
              operator.toLowerCase() === MARKETPLACE_CONTRACT_ADDRESS.toLowerCase()) {
            setIsApprovedForAll(approved);
            if (approved) {
              toast.success('Marketplace approved successfully!');
            } else {
              toast.info('Marketplace approval revoked');
            }
          }
        });

        // Check initial approval status
        await checkApprovalStatus();
      } catch (error: any) {
        console.error('[NFTApproval] Error initializing NFT contract:', error);
        toast.error(`Failed to connect to NFT contract: ${error.message || 'Unknown error'}`);
      }
    };

    initContract();

    return () => {
      if (nftContract) {
        console.log('[NFTApproval] Cleaning up contract listeners');
        nftContract.removeAllListeners();
      }
    };
  }, [wallet?.signer, wallet?.address]);

  /**
   * Check if the Marketplace is approved to transfer all NFTs for the current user
   */
  const checkApprovalStatus = async (): Promise<boolean> => {
    if (!nftContract || !wallet?.address) {
      return false;
    }

    try {
      setIsCheckingApproval(true);
      const approved = await nftContract.isApprovedForAll(
        wallet.address,
        MARKETPLACE_CONTRACT_ADDRESS
      );
      setIsApprovedForAll(approved);
      return approved;
    } catch (error) {
      console.error('Error checking approval status:', error);
      return false;
    } finally {
      setIsCheckingApproval(false);
    }
  };

  /**
   * Approve the Marketplace to transfer all NFTs owned by the user
   * This is required BEFORE listing any NFT
   */
  const approveMarketplace = async (): Promise<boolean> => {
    if (!nftContract) {
      console.error('[NFTApproval] NFT contract not initialized');
      toast.error('NFT contract not initialized. Please refresh the page.');
      return false;
    }

    if (!wallet?.signer) {
      console.error('[NFTApproval] No signer available');
      toast.error('Please connect your wallet');
      return false;
    }

    if (!wallet?.address) {
      console.error('[NFTApproval] No wallet address');
      toast.error('Wallet address not found');
      return false;
    }

    try {
      console.log('[NFTApproval] Starting approval...');
      console.log('[NFTApproval] User address:', wallet.address);
      console.log('[NFTApproval] Marketplace address:', MARKETPLACE_CONTRACT_ADDRESS);
      console.log('[NFTApproval] NFT Contract address:', NFT_CONTRACT_ADDRESS);
      
      toast.info('Requesting approval transaction...');
      
      // Estimate gas first
      try {
        const gasEstimate = await nftContract.setApprovalForAll.estimateGas(
          MARKETPLACE_CONTRACT_ADDRESS,
          true
        );
        console.log('[NFTApproval] Gas estimate:', gasEstimate.toString());
      } catch (gasError: any) {
        console.error('[NFTApproval] Gas estimation failed:', gasError);
        toast.error(`Gas estimation failed: ${gasError.message || 'Unknown error'}`);
        return false;
      }

      const tx = await nftContract.setApprovalForAll(MARKETPLACE_CONTRACT_ADDRESS, true);
      console.log('[NFTApproval] Transaction sent:', tx.hash);
      
      toast.info(`Transaction sent! Hash: ${tx.hash.substring(0, 10)}...`);
      toast.info('Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log('[NFTApproval] Transaction confirmed:', receipt);
      
      toast.success('✅ Marketplace approved! You can now list your NFTs.');
      setIsApprovedForAll(true);
      
      // Verify approval
      await checkApprovalStatus();
      
      return true;
    } catch (error: any) {
      console.error('[NFTApproval] Error approving marketplace:', error);
      console.error('[NFTApproval] Error details:', {
        code: error.code,
        message: error.message,
        reason: error.reason,
        data: error.data
      });
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error('❌ Transaction rejected by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('❌ Insufficient funds for gas');
      } else if (error.reason) {
        toast.error(`❌ Transaction failed: ${error.reason}`);
      } else if (error.message) {
        toast.error(`❌ Failed: ${error.message}`);
      } else {
        toast.error('❌ Failed to approve marketplace. Check console for details.');
      }
      return false;
    }
  };

  /**
   * Revoke Marketplace approval
   */
  const revokeMarketplaceApproval = async (): Promise<boolean> => {
    if (!nftContract || !wallet?.signer) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      toast.info('Revoking approval...');
      const tx = await nftContract.setApprovalForAll(MARKETPLACE_CONTRACT_ADDRESS, false);
      toast.info('Waiting for transaction confirmation...');
      await tx.wait();
      toast.success('Marketplace approval revoked');
      setIsApprovedForAll(false);
      return true;
    } catch (error: any) {
      console.error('Error revoking approval:', error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to revoke approval');
      }
      return false;
    }
  };

  /**
   * Approve marketplace for a specific token
   */
  const approveToken = async (tokenId: string): Promise<boolean> => {
    if (!nftContract || !wallet?.signer) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      toast.info('Approving token...');
      const tx = await nftContract.approve(MARKETPLACE_CONTRACT_ADDRESS, tokenId);
      toast.info('Waiting for transaction confirmation...');
      await tx.wait();
      toast.success('Token approved!');
      return true;
    } catch (error: any) {
      console.error('Error approving token:', error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to approve token');
      }
      return false;
    }
  };

  /**
   * Check if a specific token is approved
   */
  const checkTokenApproval = async (tokenId: string): Promise<boolean> => {
    if (!nftContract) return false;

    try {
      const approved = await nftContract.getApproved(tokenId);
      return approved.toLowerCase() === MARKETPLACE_CONTRACT_ADDRESS.toLowerCase();
    } catch (error) {
      console.error('Error checking token approval:', error);
      return false;
    }
  };

  return {
    isApprovedForAll,
    isCheckingApproval,
    checkApprovalStatus,
    approveMarketplace,
    revokeMarketplaceApproval,
    approveToken,
    checkTokenApproval,
  };
};
