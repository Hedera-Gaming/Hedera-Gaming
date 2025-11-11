import { ethers } from 'ethers';

// Import ABI (you'll generate these after compilation)
import NFTCollectionABI from '../../../smartcontracts/artifacts/contracts/NFTCollection.sol/NFTCollection.json';
import MarketplaceABI from '../../../smartcontracts/artifacts/contracts/Marketplace.sol/Marketplace.json';
import LeaderboardABI from '../../../smartcontracts/artifacts/contracts/Leaderboard.sol/Leaderboard.json';
import VerifierABI from '../../../smartcontracts/artifacts/contracts/AchievementVerifier.sol/AchievementVerifier.json';

const RPC_URL = 'https://testnet.hashio.io/api';

export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;
  
  private nftContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;
  private leaderboardContract: ethers.Contract | null = null;
  private verifierContract: ethers.Contract | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
  }

  async connect(privateKey: string) {
    this.signer = new ethers.Wallet(privateKey, this.provider);
    
    const nftAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
    const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
    const leaderboardAddress = import.meta.env.VITE_LEADERBOARD_CONTRACT_ADDRESS;
    const verifierAddress = import.meta.env.VITE_VERIFIER_CONTRACT_ADDRESS;

    this.nftContract = new ethers.Contract(nftAddress, NFTCollectionABI.abi, this.signer);
    this.marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, this.signer);
    this.leaderboardContract = new ethers.Contract(leaderboardAddress, LeaderboardABI.abi, this.signer);
    this.verifierContract = new ethers.Contract(verifierAddress, VerifierABI.abi, this.signer);
  }

  // NFT Functions
  async mintNFT(playerAddress: string, achievementId: number, metadataURI: string) {
    if (!this.nftContract) throw new Error('Not connected');
    
    const signature = ethers.hexlify(ethers.randomBytes(65)); // Simplified signature
    const tx = await this.nftContract.mintNFT(playerAddress, achievementId, metadataURI, signature);
    const receipt = await tx.wait();
    
    return receipt;
  }

  async getPlayerNFTs(playerAddress: string) {
    if (!this.nftContract) throw new Error('Not connected');
    
    const tokenIds = await this.nftContract.getOwnerTokens(playerAddress);
    const nfts = [];
    
    for (const tokenId of tokenIds) {
      const nft = await this.nftContract.getNFT(tokenId);
      nfts.push({
        tokenId: nft.tokenId.toString(),
        achievementId: nft.achievementId.toString(),
        owner: nft.owner,
        metadataURI: nft.metadataURI,
        mintedAt: new Date(Number(nft.mintedAt) * 1000)
      });
    }
    
    return nfts;
  }

  // Marketplace Functions
  async listNFT(tokenId: number, priceInHBAR: number) {
    if (!this.marketplaceContract) throw new Error('Not connected');
    
    const priceInWei = ethers.parseEther(priceInHBAR.toString());
    const tx = await this.marketplaceContract.createListing(tokenId, priceInWei);
    const receipt = await tx.wait();
    
    return receipt;
  }

  async buyNFT(listingId: number, priceInHBAR: number) {
    if (!this.marketplaceContract) throw new Error('Not connected');
    
    const priceInWei = ethers.parseEther(priceInHBAR.toString());
    const tx = await this.marketplaceContract.buyNFT(listingId, { value: priceInWei });
    const receipt = await tx.wait();
    
    return receipt;
  }

  // Leaderboard Functions
  async updateScore(playerAddress: string, score: number, kills: number, accuracy: number, survival: number) {
    if (!this.leaderboardContract) throw new Error('Not connected');
    
    const accuracyScaled = Math.floor(accuracy * 100); // Convert to percentage * 100
    const tx = await this.leaderboardContract.updateScore(playerAddress, score, kills, accuracyScaled, survival);
    const receipt = await tx.wait();
    
    return receipt;
  }

  async getTopPlayers(count: number = 10) {
    if (!this.leaderboardContract) throw new Error('Not connected');
    
    const [players, scores] = await this.leaderboardContract.getTopPlayers(count);
    
    return players.map((player: string, index: number) => ({
      address: player,
      score: scores[index].toString()
    }));
  }

  // Verifier Functions
  async verifySession(playerAddress: string, score: number, kills: number, accuracy: number, timeSurvived: number) {
    if (!this.verifierContract) throw new Error('Not connected');
    
    const accuracyScaled = Math.floor(accuracy * 100);
    const signature = ethers.hexlify(ethers.randomBytes(65)); // Simplified
    
    const tx = await this.verifierContract.verifySession(
      playerAddress,
      score,
      kills,
      accuracyScaled,
      timeSurvived,
      signature
    );
    const receipt = await tx.wait();
    
    return receipt;
  }

  async checkAchievement(playerAddress: string, achievementId: number) {
    if (!this.verifierContract) throw new Error('Not connected');
    
    return await this.verifierContract.checkAchievement(playerAddress, achievementId);
  }
}

export const contractService = new ContractService();