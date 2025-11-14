import deployedContracts from '../smartcontracts/deployed-contracts.json';

export const getNFTCollectionAddress = () => {
  return deployedContracts.NFTCollection;
};

export const getMarketplaceAddress = () => {
  return deployedContracts.Marketplace;
};

export const getLeaderboardAddress = () => {
  return deployedContracts.Leaderboard;
};

export const getAchievementVerifierAddress = () => {
  return deployedContracts.AchievementVerifier;
};