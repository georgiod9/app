'use client'
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { IBM_Plex_Mono } from "next/font/google";

// import { SolanaProvider } from '@/utils/solanaConfig';
import SolanaContextProvider from '@/utils/solanaContext'

const ibm = IBM_Plex_Mono({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700'] })

function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <SolanaContextProvider>
        {/* <SolanaProvider> */}
        <main className={`${ibm.className} bg-bg`}>
          <Component {...pageProps} />
        </main>
        {/* </SolanaProvider> */}
      </SolanaContextProvider>
    </>
  );
}

export default App
