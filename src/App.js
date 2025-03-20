import { ADDRESS, AMOUNT } from './config/constants';
import { useConnect } from './hooks/useConnect';
import { useTransaction } from './hooks/useTransaction';
import { Container } from './components/Container/Container';
import { Button } from './components/Button/Button';

const App = () => {
  const { connect, disconnect, isConnected, provider, walletAddress } = useConnect();

  const {
    commitTransaction,
    createTransaction,
    hasTransaction,
    isCommitingTransaction,
    isCreatingTransaction
  } = useTransaction(provider);

  return (
    <div className="wrapper">
      <Container>
        {!isConnected && <Button onClick={connect}>CONNECT</Button>}

        {isConnected && <Button onClick={disconnect}>DISCONNECT</Button>}

        {isConnected && !hasTransaction && (
          <Button
            disabled={isCreatingTransaction}
            onClick={() => createTransaction({ amount: AMOUNT, destination: ADDRESS, origin: walletAddress })}
          >
            CREATE TRANSACTION
          </Button>
        )}

        {isConnected && hasTransaction && (
          <Button
            disabled={isCommitingTransaction}
            onClick={commitTransaction}
          >
            COMMIT TRANSACTION
          </Button>
        )}
      </Container>
    </div>
  );
}

export default App;
