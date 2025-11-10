import { Provider, Contract, Signer } from 'ethers';

// Import ABIs
import NFTCollectionABI from '../../../smartcontracts/artifacts/contracts/NFTCollection.sol/NFTCollection.json';
import MarketplaceABI from '../../../smartcontracts/artifacts/contracts/Marketplace.sol/Marketplace.json';
import LeaderboardABI from '../../../smartcontracts/artifacts/contracts/Leaderboard.sol/Leaderboard.json';
import AchievementVerifierABI from '../../../smartcontracts/artifacts/contracts/AchievementVerifier.sol/AchievementVerifier.json';

// Contract addresses from environment variables
const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
const MARKETPLACE_CONTRACT_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
const LEADERBOARD_CONTRACT_ADDRESS = import.meta.env.VITE_LEADERBOARD_CONTRACT_ADDRESS;
const VERIFIER_CONTRACT_ADDRESS = import.meta.env.VITE_VERIFIER_CONTRACT_ADDRESS;

export const getContractInstances = (signer: Signer) => {
  const nftCollection = new Contract(
    NFT_CONTRACT_ADDRESS,
    NFTCollectionABI.abi,
    signer
  );

  const marketplace = new Contract(
    MARKETPLACE_CONTRACT_ADDRESS,
    MarketplaceABI.abi,
    signer
  );

  const leaderboard = new Contract(
    LEADERBOARD_CONTRACT_ADDRESS,
    LeaderboardABI.abi,
    signer
  );

  const achievementVerifier = new Contract(
    VERIFIER_CONTRACT_ADDRESS,
    AchievementVerifierABI.abi,
    signer
  );

  return {
    nftCollection,
    marketplace,
    leaderboard,
    achievementVerifier
  };
};