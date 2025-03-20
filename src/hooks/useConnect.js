import { useCallback, useEffect, useState } from 'react';

const provider = window.phantom?.solana || {};

export const useConnect = () => {
  const [walletAddress, setWalletAddress] = useState(provider.publicKey?.toString?.());

  const connect = useCallback(() => provider.connect?.(), []);
  const disconnect = useCallback(() => provider.disconnect?.(), []);

  useEffect(() => {
    if (!provider) {
      return;
    }

    provider.on('connect', publicKey => setWalletAddress(publicKey.toString()));
    provider.on('disconnect', () => setWalletAddress(null));

    return () => provider.removeAllListeners();
  }, []);

  return { connect, disconnect, isConnected: !!provider.isConnected, provider, walletAddress };
};
