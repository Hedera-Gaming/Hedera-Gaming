import { BaseContract, BigNumberish } from "ethers";

export interface NFTContract extends BaseContract {
  getAchievement(achievementId: BigNumberish): Promise<{
    id: bigint;
    name: string;
    description: string;
    rarity: string;
    requirement: bigint;
    achievementType: string;
  }>;
  
  getNFT(tokenId: BigNumberish): Promise<{
    id: bigint;
    achievementId: bigint;
    ownerAddr: string;
    metadataURI: string;
    mintedAt: bigint;
    exists: boolean;
  }>;
  
  getOwnerTokens(owner: string): Promise<bigint[]>;
  
  mintNFT(
    player: string,
    achievementId: BigNumberish,
    metadataURI: string,
    signature: string
  ): Promise<any>;
}

export interface VerifierContract extends BaseContract {
  verifySession(
    player: string,
    score: BigNumberish,
    kills: BigNumberish,
    accuracy: BigNumberish,
    timeSurvived: BigNumberish,
    signature: string
  ): Promise<string>;
  
  checkAchievement(player: string, achievementId: BigNumberish): Promise<boolean>;
}