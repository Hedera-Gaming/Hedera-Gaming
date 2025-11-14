import { useEffect, useState } from 'react';
import { Contract, JsonRpcSigner } from 'ethers';
import { getContractInstances } from '../shared/utils/contracts/contract-instances';

export const useContracts = (signer: JsonRpcSigner | null) => {
  const [contracts, setContracts] = useState<{
    nftCollection: Contract | null;
    marketplace: Contract | null;
    leaderboard: Contract | null;
    achievementVerifier: Contract | null;
  }>({
    nftCollection: null,
    marketplace: null,
    leaderboard: null,
    achievementVerifier: null,
  });

  useEffect(() => {
    if (!signer) return;

    const instances = getContractInstances(signer);
    setContracts(instances);
  }, [signer]);

  return contracts;
};