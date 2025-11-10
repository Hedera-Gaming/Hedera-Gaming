import { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { HederaWalletConnector } from '@hashgraph/hedera-wallet-connect';

export const useHederaWallet = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

  // Initialiser HederaWalletConnector
  const connector = new HederaWalletConnector();
  await connector.connect();
  const provider = new BrowserProvider(connector.getProvider());
  const signer = await provider.getSigner();
  const accounts = await provider.listAccounts();
  setProvider(provider);
  setSigner(signer);
  setAccountId(accounts[0]?.address || null);
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setSigner(null);
    setProvider(null);
    setAccountId(null);
  };

  return {
    signer,
    provider,
    accountId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet
  };
};