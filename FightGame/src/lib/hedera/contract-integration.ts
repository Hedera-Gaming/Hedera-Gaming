import { ethers } from 'ethers';
import NFTCollectionABI from '../../../smartcontracts/artifacts/contracts/NFTCollection.sol/NFTCollection.json';
import MarketplaceABI from '../../../smartcontracts/artifacts/contracts/Marketplace.sol/Marketplace.json';
import LeaderboardABI from '../../../smartcontracts/artifacts/contracts/Leaderboard.sol/Leaderboard.json';
import VerifierABI from '../../../smartcontracts/artifacts/contracts/AchievementVerifier.sol/AchievementVerifier.json';

const RPC_URL = 'https://testnet.hashio.io/api';
const CONTRACTS = {
  NFT: '0x1D5bF5f2b45E1589C8138fbf47ad7aa8c1ab0d52',
  MARKETPLACE: '0xcb6E00327FF11AF4b8b2830f4779817fb0A94a71',
  LEADERBOARD: '0x0C66919F860710BaC7F0B226A1AB8d9DcbfaC40C',
  VERIFIER: '0x90a6Eccf261fF79d9110743f056e2779C61c1b10',
};

export class GameContractService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet | null = null;
  private nftContract: ethers.Contract | null = null;
  private leaderboardContract: ethers.Contract | null = null;
  private verifierContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
  }

  async connectWallet(privateKey: string) {
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.nftContract = new ethers.Contract(
      CONTRACTS.NFT,
      NFTCollectionABI.abi,
      this.signer
    );
    this.leaderboardContract = new ethers.Contract(
      CONTRACTS.LEADERBOARD,
      LeaderboardABI.abi,
      this.signer
    );
    this.verifierContract = new ethers.Contract(
      CONTRACTS.VERIFIER,
      VerifierABI.abi,
      this.signer
    );
    this.marketplaceContract = new ethers.Contract(
      CONTRACTS.MARKETPLACE,
      MarketplaceABI.abi,
      this.signer
    );
    return this.signer.address;
  }

  async submitGameScore(
    playerAddress: string,
    score: number,
    kills: number,
    accuracy: number,
    survival: number
  ) {
    if (!this.leaderboardContract) throw new Error('Not connected');

    const accuracyScaled = Math.floor(accuracy * 100);
    const tx = await this.leaderboardContract.updateScore(
      playerAddress,
      score,
      kills,
      accuracyScaled,
      survival
    );
    return await tx.wait();
  }

  async verifyGameSession(
    playerAddress: string,
    score: number,
    kills: number,
    accuracy: number,
    timeSurvived: number
  ) {
    if (!this.verifierContract) throw new Error('Not connected');

    const accuracyScaled = Math.floor(accuracy * 100);
    const timestamp = Math.floor(Date.now() / 1000);

    const sessionHash = ethers.keccak256(
      ethers.solidityPacked(
        ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        [playerAddress, score, kills, accuracyScaled, timeSurvived, timestamp]
      )
    );

    const tx = await this.verifierContract.verifySession(
      playerAddress,
      score,
      kills,
      accuracyScaled,
      timeSurvived,
      timestamp,
      sessionHash
    );

    return await tx.wait();
  }

  async checkAchievementEligibility(
    playerAddress: string,
    achievementId: number
  ) {
    if (!this.verifierContract) throw new Error('Not connected');
    return await this.verifierContract.canClaimAchievement(
      playerAddress,
      achievementId
    );
  }

  async claimAchievement(playerAddress: string, achievementId: number) {
    if (!this.verifierContract) throw new Error('Not connected');

    const tx = await this.verifierContract.claimAchievement(
      playerAddress,
      achievementId
    );
    return await tx.wait();
  }

  async mintNFT(
    playerAddress: string,
    achievementId: number,
    metadataURI: string
  ) {
    if (!this.nftContract) throw new Error('Not connected');

    const signature = ethers.hexlify(ethers.randomBytes(65));
    const tx = await this.nftContract.mintNFT(
      playerAddress,
      achievementId,
      metadataURI,
      signature
    );
    const receipt = await tx.wait();

    const mintEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = this.nftContract!.interface.parseLog(log);
        return parsed?.name === 'NFTMinted';
      } catch {
        return false;
      }
    });

    if (mintEvent) {
      const parsed = this.nftContract.interface.parseLog(mintEvent);
      return {
        tokenId: parsed?.args.tokenId.toString(),
        receipt,
      };
    }

    return { tokenId: null, receipt };
  }

  async getPlayerScore(playerAddress: string) {
    if (!this.leaderboardContract) throw new Error('Not connected');

    const score = await this.leaderboardContract.getPlayerScore(playerAddress);
    return {
      player: score.player,
      highScore: score.highScore.toString(),
      totalKills: score.totalKills.toString(),
      bestAccuracy: Number(score.bestAccuracy) / 100,
      longestSurvival: score.longestSurvival.toString(),
      lastUpdated: new Date(Number(score.lastUpdated) * 1000),
    };
  }

  async getPlayerNFTs(playerAddress: string) {
    if (!this.nftContract) throw new Error('Not connected');

    const tokenIds = await this.nftContract.getOwnerTokens(playerAddress);
    const nfts = [];

    for (const tokenId of tokenIds) {
      const nft = await this.nftContract.getNFT(tokenId);
      const achievement = await this.nftContract.getAchievement(
        nft.achievementId
      );

      nfts.push({
        tokenId: nft.tokenId.toString(),
        achievementId: nft.achievementId.toString(),
        achievementName: achievement.name,
        achievementRarity: achievement.rarity,
        owner: nft.ownerAddr,
        metadataURI: nft.metadataURI,
        mintedAt: new Date(Number(nft.mintedAt) * 1000),
      });
    }

    return nfts;
  }

  async getAchievementInfo(achievementId: number) {
    if (!this.nftContract) throw new Error('Not connected');

    const achievement = await this.nftContract.getAchievement(achievementId);
    return {
      id: achievement.id.toString(),
      name: achievement.name,
      description: achievement.description,
      rarity: achievement.rarity,
      requirement: achievement.requirement.toString(),
      achievementType: achievement.achievementType,
    };
  }

  getContractAddresses() {
    return CONTRACTS;
  }
}

export const contractService = new GameContractService();
