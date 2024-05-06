import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets'
import * as web3 from '@solana/web3.js';

const SolanaContextProvider = ({ children }) => {

    const endpoint = web3.clusterApiUrl('mainnet-beta')
    const wallets = [
        new walletAdapterWallets.PhantomWalletAdapter(),
        new walletAdapterWallets.SolflareWalletAdapter(),
        new walletAdapterWallets.TorusWalletAdapter(),
        new walletAdapterWallets.LedgerWalletAdapter()
    ];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default SolanaContextProvider;