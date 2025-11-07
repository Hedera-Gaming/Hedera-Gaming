import { useState, useCallback, useRef } from 'react';
import { contractService } from '../lib/hedera/contract-integration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GameStats {
  score: number;
  kills: number;
  accuracy: number;
  survivalTime: number;
}

export const useBlockchainIntegration = (
  walletAddress: string | null,
  profileId: string | null
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<string[]>([]);
  const processingRef = useRef(false);

  const recordTransaction = useCallback(
    async (
      type: string,
      status: string,
      txHash: string | null,
      metadata: any
    ) => {
      if (!profileId) return;

      try {
        await supabase.from('blockchain_transactions').insert({
          profile_id: profileId,
          transaction_type: type,
          status: status,
          hedera_tx_id: txHash,
          metadata: metadata,
        });
      } catch (error) {
        console.error('Failed to record transaction:', error);
      }
    },
    [profileId]
  );

  const submitScoreToBlockchain = useCallback(
    async (gameStats: GameStats) => {
      if (!walletAddress || !profileId || processingRef.current) return null;

      processingRef.current = true;
      setIsProcessing(true);
      const txId = `score-${Date.now()}`;
      setPendingTransactions((prev) => [...prev, txId]);

      try {
        toast.info('Submitting score to blockchain...');

        const receipt = await contractService.submitGameScore(
          walletAddress,
          gameStats.score,
          gameStats.kills,
          gameStats.accuracy,
          Math.floor(gameStats.survivalTime)
        );

        await recordTransaction('update_score', 'success', receipt.hash, {
          score: gameStats.score,
          kills: gameStats.kills,
          accuracy: gameStats.accuracy,
          survivalTime: gameStats.survivalTime,
        });

        toast.success('Score recorded on Hedera!');
        return receipt.hash;
      } catch (error: any) {
        console.error('Blockchain score submission failed:', error);

        await recordTransaction('update_score', 'failed', null, {
          error: error.message,
          ...gameStats,
        });

        toast.error('Failed to record score on blockchain');
        return null;
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
        setPendingTransactions((prev) => prev.filter((id) => id !== txId));
      }
    },
    [walletAddress, profileId, recordTransaction]
  );

  const verifyAndSubmitSession = useCallback(
    async (gameStats: GameStats) => {
      if (!walletAddress || !profileId || processingRef.current) return null;

      processingRef.current = true;
      setIsProcessing(true);
      const txId = `verify-${Date.now()}`;
      setPendingTransactions((prev) => [...prev, txId]);

      try {
        toast.info('Verifying game session...');

        const receipt = await contractService.verifyGameSession(
          walletAddress,
          gameStats.score,
          gameStats.kills,
          gameStats.accuracy,
          Math.floor(gameStats.survivalTime)
        );

        await recordTransaction('verify_session', 'success', receipt.hash, {
          sessionVerified: true,
          ...gameStats,
        });

        toast.success('Session verified on blockchain!');
        return receipt.hash;
      } catch (error: any) {
        console.error('Session verification failed:', error);

        await recordTransaction('verify_session', 'failed', null, {
          error: error.message,
          ...gameStats,
        });

        toast.error('Session verification failed');
        return null;
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
        setPendingTransactions((prev) => prev.filter((id) => id !== txId));
      }
    },
    [walletAddress, profileId, recordTransaction]
  );

  const checkAndClaimAchievements = useCallback(
    async (gameStats: GameStats) => {
      if (!walletAddress || !profileId) return [];

      const claimedAchievements = [];

      try {
        for (let achievementId = 1; achievementId <= 10; achievementId++) {
          const canClaim = await contractService.checkAchievementEligibility(
            walletAddress,
            achievementId
          );

          if (canClaim) {
            try {
              const receipt = await contractService.claimAchievement(
                walletAddress,
                achievementId
              );

              const achievement = await contractService.getAchievementInfo(
                achievementId
              );

              await recordTransaction(
                'claim_achievement',
                'success',
                receipt.hash,
                { achievementId, achievementName: achievement.name }
              );

              claimedAchievements.push({
                id: achievementId,
                name: achievement.name,
                rarity: achievement.rarity,
                txHash: receipt.hash,
              });

              toast.success(`Achievement unlocked: ${achievement.name}!`);
            } catch (error) {
              console.error(
                `Failed to claim achievement ${achievementId}:`,
                error
              );
            }
          }
        }
      } catch (error) {
        console.error('Achievement check failed:', error);
      }

      return claimedAchievements;
    },
    [walletAddress, profileId, recordTransaction]
  );

  const mintNFTReward = useCallback(
    async (achievementId: number, metadata: any) => {
      if (!walletAddress || !profileId || processingRef.current) return null;

      processingRef.current = true;
      setIsProcessing(true);
      const txId = `mint-${Date.now()}`;
      setPendingTransactions((prev) => [...prev, txId]);

      try {
        toast.info('Minting NFT reward...');

        const metadataURI = `ipfs://achievement-${achievementId}-${Date.now()}`;

        const { tokenId, receipt } = await contractService.mintNFT(
          walletAddress,
          achievementId,
          metadataURI
        );

        await supabase.from('nft_rewards').insert({
          profile_id: profileId,
          wallet_address: walletAddress,
          achievement_id: achievementId,
          token_id: tokenId,
          metadata: metadata,
          hedera_tx_id: receipt.hash,
        });

        await recordTransaction('mint_nft', 'success', receipt.hash, {
          tokenId,
          achievementId,
          metadataURI,
        });

        toast.success(`🎉 NFT Minted! Token ID: ${tokenId}`);
        return { tokenId, txHash: receipt.hash };
      } catch (error: any) {
        console.error('NFT minting failed:', error);

        await recordTransaction('mint_nft', 'failed', null, {
          error: error.message,
          achievementId,
        });

        toast.error('Failed to mint NFT');
        return null;
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
        setPendingTransactions((prev) => prev.filter((id) => id !== txId));
      }
    },
    [walletAddress, profileId, recordTransaction]
  );

  const syncPlayerData = useCallback(async () => {
    if (!walletAddress) return null;

    try {
      const [blockchainScore, nfts] = await Promise.all([
        contractService.getPlayerScore(walletAddress),
        contractService.getPlayerNFTs(walletAddress),
      ]);

      if (profileId) {
        await supabase
          .from('profiles')
          .update({
            total_score: Number(blockchainScore.highScore),
            total_kills: Number(blockchainScore.totalKills),
            total_nfts: nfts.length,
          })
          .eq('id', profileId);
      }

      return { blockchainScore, nfts };
    } catch (error) {
      console.error('Failed to sync player data:', error);
      return null;
    }
  }, [walletAddress, profileId]);

  return {
    isProcessing,
    pendingTransactions,
    submitScoreToBlockchain,
    verifyAndSubmitSession,
    checkAndClaimAchievements,
    mintNFTReward,
    syncPlayerData,
  };
};
