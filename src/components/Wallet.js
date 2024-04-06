import "../styles/wallet.css";
import { Header, Payload, SIWS } from "@web3auth/sign-in-with-solana";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import bs58 from 'bs58';

export const Wallet = () => {
  const [address, setAddress] = useState();
  const [signature, setSignature] = useState();
  const [siwsMessage, setSiwsMessage] = useState();
  const { connected, signMessage, publicKey } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      setAddress(publicKey.toString());
    }
  }, [connected, publicKey]);

  const createSolanaMessage = async () => {
    const header = new Header();
    const payload = new Payload();

    header.t = "sip99";
    payload.domain = window.location.host;
    payload.address = publicKey.toString();
    payload.uri = window.location.origin;
    payload.statement = "Hackathon Bugsbyte";
    payload.version = "1";
    payload.chainId = 1;

    let message = new SIWS({ header, payload });

    const messageText = message.prepareMessage();
    const messageEncoded = new TextEncoder().encode(messageText);

    setSiwsMessage(message);
    
    const signedMessage = await signMessage(messageEncoded);

    setSignature(bs58.encode(signedMessage));
  }

  const onClickBack = () => {
    setSignature(null)
    setSiwsMessage(null);
  }

  const onClickVerify = async () => {
    const verifyResponse = await siwsMessage.verify({
      payload: siwsMessage.payload,
      signature: { t: "sip99", s: signature }
    });

    if (verifyResponse.success) {
      Swal.fire("Success", "Signature Verified", "success")
    } else {
      Swal.fire("Error", verifyResponse.error.type, "error")
    }
  }

  return (
    <div className="main">
      {
        connected &&
        !signature && (
          <>
            <p className="sign">Sign Transaction</p>

            <input className="publicKey" id="publicKey" readOnly type="text" value={address} />

            <button className="web3auth" id="w3aBtn" onClick={createSolanaMessage}>Sign in with Solana</button>

            <WalletDisconnectButton className="walletButtons" />
          </>
        )
      }

      {
        !connected &&
        !signature && (
          <>
            <p className="sign">Sign in With Solana</p>

            <WalletModalProvider>
              <WalletMultiButton className="walletButtons" />
            </WalletModalProvider>
          </>
        )
      }

      {
        signature && (
          <>
            <p className="sign">Verify Signature</p>

            <input
              className="signature"
              id="signature"
              onChange={event => setSignature(event.target.value)}
              readOnly
              type="text"
              value={signature}
            />

            <button className="web3auth" id="verify" onClick={onClickVerify}>Verify</button>
            
            <button className="web3auth" id="verify" onClick={onClickBack}>Back to Wallet</button>
          </>
        )
      }
    </div>
  );
};
