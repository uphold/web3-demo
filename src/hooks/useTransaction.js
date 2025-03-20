import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { NETWORK } from '../config/constants';
import { useCallback, useRef, useState } from 'react';

const connection = new Connection(NETWORK);

export const useTransaction = provider => {
  const [isCommitingTransaction, setIsCommitingTransaction] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const transaction = useRef(null);

  const commitTransaction = useCallback(async () => {
    try {
      setIsCommitingTransaction(true);
  
      await provider.signAndSendTransaction(transaction.current);
      
      transaction.current = null;
    } catch (error) {
      console.log(JSON.stringify(error));
      
    } finally {
      setIsCommitingTransaction(false);
    }

    return;
  }, [provider]);
  
  const createTransaction = useCallback(async ({ amount, destination, origin }) => {
    try {
      setIsCreatingTransaction(true);

      const destinationKey = new PublicKey(destination);
      const originKey = new PublicKey(origin);
  
      transaction.current = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: originKey,
          toPubkey: destinationKey,
          lamports: amount
        })
      );
      transaction.current.feePayer = originKey;
      transaction.current.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      return Promise.resolve();
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setIsCreatingTransaction(false);
    }

    return;
  }, []);

  return {
    commitTransaction,
    createTransaction,
    hasTransaction: !!transaction?.current,
    isCommitingTransaction,
    isCreatingTransaction
  };
};
