import { Signer } from "ethers";

export interface HederaWallet {
  address: string;
  signer: Signer;
  profileId?: string;
  playerName?: string;
}

export interface GameStats {
  score: number;
  kills: number;
  accuracy: number;
  timeSurvived: number;
}