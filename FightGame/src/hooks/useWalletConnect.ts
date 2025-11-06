import { useState, useEffect, useCallback } from 'react';
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
}

export const useWalletConnect = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const loadWallet = async () => {
      const savedWallet = localStorage.getItem('wallet');
      if (savedWallet) {
        const walletData = JSON.parse(savedWallet);
        
        // Fetch profile data from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletData.address)
          .single();

        if (profile) {
          setWallet({
            ...walletData,
            profileId: profile.id,
            playerName: profile.username || 'Player',
          });
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
        toast.error('MetaMask n\'est pas installé');
        return false;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];

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
        profileId: profile.id,
        playerName: profile.username || 'Player',
      };

      setWallet(walletInfo);
      localStorage.setItem('wallet', JSON.stringify(walletInfo));
      toast.success('MetaMask connecté avec succès');
      return true;
    } catch (error) {
      console.error('Error connecting MetaMask:', error);
      toast.error('Erreur lors de la connexion à MetaMask');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectHashPack = useCallback(async () => {
    setIsConnecting(true);
    try {
      toast.info('HashPack: Veuillez connecter votre wallet dans l\'extension');
      
      // This would require HashConnect SDK integration
      // For now, we'll show a placeholder
      toast.error('HashPack integration en cours de développement');
      return false;
    } catch (error) {
      console.error('Error connecting HashPack:', error);
      toast.error('Erreur lors de la connexion à HashPack');
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
