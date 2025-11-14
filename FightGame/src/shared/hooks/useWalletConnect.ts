import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Declare ethereum on window for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletInfo {
  address: string;
  type: 'metamask' | 'hashpack';
  hederaAccountId?: string;
  profileId?: string;
  playerName?: string;
  provider?: ethers.BrowserProvider;
  signer?: ethers.Signer;
}

export const useWalletConnect = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wallet from localStorage on mount and reconnect provider
  useEffect(() => {
    const loadWallet = async () => {
      const savedWallet = localStorage.getItem('wallet');
      if (savedWallet) {
        try {
          const walletData = JSON.parse(savedWallet);
          
          // Fetch profile data from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('wallet_address', walletData.address)
            .single();

          if (profile && walletData.type === 'metamask' && window.ethereum) {
            // Reconnect provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            setWallet({
              ...walletData,
              profileId: profile.id,
              playerName: profile.username || 'Player',
              provider,
              signer,
            });
          } else if (profile) {
            setWallet({
              ...walletData,
              profileId: profile.id,
              playerName: profile.username || 'Player',
            });
          }
        } catch (error) {
          console.error('Error loading wallet:', error);
          localStorage.removeItem('wallet');
        }
      }
      setIsInitialized(true);
    };

    loadWallet();
  }, []);

  const connectMetaMask = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        toast.error('MetaMask n\'est pas installé. Veuillez installer l\'extension MetaMask.');
        window.open('https://metamask.io/download/', '_blank');
        return false;
      }

      // Create provider and request accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      const signer = await provider.getSigner();

      // Check network (Hedera Testnet chainId: 296)
      const network = await provider.getNetwork();
      console.log('Connected to network:', network.chainId);

      // Check if profile exists
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      // Create profile if it doesn't exist
      if (error || !profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            wallet_address: address,
            wallet_type: 'metamask',
            username: `Player-${address.slice(0, 6)}`,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      const walletInfo: WalletInfo = {
        address,
        type: 'metamask',
        profileId: profile!.id,
        playerName: profile!.username || 'Player',
        provider,
        signer,
      };

      setWallet(walletInfo);
      
      // Save basic info to localStorage (not provider/signer)
      localStorage.setItem('wallet', JSON.stringify({
        address,
        type: 'metamask',
        profileId: profile!.id,
        playerName: profile!.username || 'Player',
      }));
      
      toast.success(`✅ MetaMask connecté: ${address.slice(0, 6)}...${address.slice(-4)}`);
      return true;
    } catch (error: any) {
      console.error('Error connecting MetaMask:', error);
      if (error.code === 4001) {
        toast.error('Connexion refusée par l\'utilisateur');
      } else if (error.code === -32002) {
        toast.error('Veuillez vérifier MetaMask, une demande de connexion est en attente');
      } else {
        toast.error('Erreur lors de la connexion à MetaMask');
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectHashPack = useCallback(async () => {
    setIsConnecting(true);
    try {
      toast.info('🔗 HashPack: Ouvrez l\'extension pour connecter votre wallet');
      
      // Dynamic import of HashConnect service
      const { hashConnectService } = await import('@/shared/utils/hedera/hashconnect');
      
      // Initialize and connect
      const pairingData: any = await hashConnectService.connect();
      
      if (!pairingData || !pairingData.accountIds || pairingData.accountIds.length === 0) {
        throw new Error('No account connected');
      }

      const accountId = pairingData.accountIds[0];
      const address = `0x${accountId.replace('.', '')}`; // Convert Hedera ID to address format

      // Check if profile exists
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      // Create profile if it doesn't exist
      if (error || !profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            wallet_address: address,
            wallet_type: 'hashpack',
            hedera_account_id: accountId,
            username: `Player-${accountId}`,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      // Create a provider-like object for HashPack
      // Note: HashPack uses Hedera SDK, not ethers.js directly
      const walletInfo: WalletInfo = {
        address,
        type: 'hashpack',
        hederaAccountId: accountId,
        profileId: profile!.id,
        playerName: profile!.username || 'Player',
        // HashPack doesn't use ethers provider/signer directly
        // Transactions will be sent through HashConnect
      };

      setWallet(walletInfo);
      
      // Save basic info to localStorage
      localStorage.setItem('wallet', JSON.stringify({
        address,
        type: 'hashpack',
        hederaAccountId: accountId,
        profileId: profile!.id,
        playerName: profile!.username || 'Player',
      }));
      
      toast.success(`✅ HashPack connecté: ${accountId}`);
      return true;
    } catch (error: any) {
      console.error('Error connecting HashPack:', error);
      if (error.message === 'Connection timeout') {
        toast.error('Connexion expirée. Veuillez réessayer.');
      } else if (error.message === 'User rejected pairing') {
        toast.error('Connexion refusée par l\'utilisateur');
      } else {
        toast.error('Erreur lors de la connexion à HashPack. Assurez-vous que l\'extension est installée.');
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    localStorage.removeItem('wallet');
    toast.info('Wallet déconnecté');
  }, []);

  return {
    wallet,
    isConnecting,
    isInitialized,
    connectMetaMask,
    connectHashPack,
    disconnect,
  };
};
