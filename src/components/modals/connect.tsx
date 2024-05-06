import React, { forwardRef, useState, useEffect, useMemo, useRef, useCallback } from 'react';

import type { WalletName } from '@solana/wallet-adapter-base';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';

import Image from 'next/image';
import Spinner from '@/utils/spinner';

interface ConnectModalProps {
    showModal: boolean;
    closeModal: () => void;
}

const ConnectModal = forwardRef<HTMLDivElement, ConnectModalProps>(({ showModal, closeModal }, ref) => {

    const { wallets, select, connect, connected, publicKey } = useWallet()
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [connecting, setConnecting] = useState(false)

    //console.log(wallets)
    //console.log('sel wal', wallet)

    // let i
    // for (i = 0; i < wallets.length; i++) {
    //     console.log(wallets[i].adapter.wallet.name)
    // }

    const [listedWallets, collapsedWallets] = useMemo(() => {
        const installed: Wallet[] = []
        const notInstalled: Wallet[] = []
        for (const wallet of wallets) {
            if (wallet.readyState === WalletReadyState.Installed) {
                installed.push(wallet)
            } else {
                notInstalled.push(wallet)
            }
        }
        return installed.length ? [installed, notInstalled] : [notInstalled, []]
    }, [wallets])

    const handleConnect = useCallback(() => {
        connect().catch((e) => {
            //console.log(e)
        })
    }, [connect])

    useEffect(() => {
        handleConnect()
    }, [connect])

    async function connectWallet(wallet: Wallet) {
        let walletName = wallet.adapter.name as WalletName
        try {
            setConnecting(true)
            if (!selectedWallet || selectedWallet != wallet) {
                select(walletName)
                setSelectedWallet(wallet)
            }
            else connect()
        } catch (e) {
            //console.error(e)
        } finally {
            setConnecting(false)
        }
    }

    useEffect(() => {
        if (connected && publicKey) {
            handleModal()
        }
    }, [connected, publicKey])

    useEffect(() => {
        const handleScroll = (event: Event) => {
            event.preventDefault();
            window.scrollTo(0, 0);
        };
        if (showModal) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('scroll', handleScroll, { passive: false });
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = '';
            window.removeEventListener('scroll', handleScroll);
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showModal]);

    const handleModal = () => {
        if (showModal) {
            closeModal();
            document.body.style.overflow = '';
        } else {
            closeModal();
            window.scrollTo(0, 0);
        }
    }

    return (
        <>
            <div ref={ref} className={`modal ${showModal ? 'block' : 'hidden'}`}>
                <>
                    <>
                        <div id='mobile-login'>
                            <div className={`sm:hidden fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`sm:hidden fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in' : ''}`}>
                                <div className="bg-bg w-full max-w-md mx-auto rounded-xl shadow-lg text-center pb-2.5">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto' onClick={handleModal}>
                                            Connect your wallet
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-10'>
                                            <div className="mx-5 mt-2.5">
                                                <div>
                                                    {listedWallets.map((wallet) => (
                                                        <button
                                                            key={wallet.adapter.name}
                                                            onClick={() => connectWallet(wallet)}
                                                            className="mt-2.5 mb-2 flex items-center text-bg bg-white hover:opacity-80 text-[13px] font-[600] p-1.5 py-1.5 px-2.5 rounded-md w-full">
                                                            <Image src={wallet.adapter.icon} alt={`${wallet.adapter.name} logo`} width={27} height={27} className="rounded-full p-1" />
                                                            <span className="pl-1.5">{wallet.adapter.name}</span>
                                                            <span className="ml-auto" />
                                                            {wallet.adapter.connecting ?
                                                                <>
                                                                    <Spinner className="mt-0.5 w-4 h-4 spinner text-[#fff] animate-spin fill-green flex justify-center mx-auto" />
                                                                </> : <>
                                                                    <span className='font-[400] text-[8px] bg-[#2E303A20] text-[#000] rounded-md px-1.5 py-0.5 mr-1'>Detected</span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-bg w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                                    </svg>
                                                                </>
                                                            }
                                                        </button>
                                                    ))}
                                                    {collapsedWallets.map((wallet) => (
                                                        <button
                                                            key={wallet.adapter.name}
                                                            onClick={() => connectWallet(wallet)}
                                                            className="mt-2.5 mb-2 flex items-center text-bg bg-white hover:opacity-80 text-[13px] font-[600] p-1.5 py-1.5 px-2.5 rounded-md w-full">
                                                            <Image src={wallet.adapter.icon} alt={`${wallet.adapter.name} logo`} width={27} height={27} className="rounded-full p-1 bg-[#2E303A20]" />
                                                            <span className="pl-1.5">{wallet.adapter.name}</span>
                                                            <span className="ml-auto" />
                                                            {wallet.adapter.connecting ?
                                                                <>
                                                                    <Spinner className="mt-0.5 w-4 h-4 spinner text-[#fff] animate-spin fill-green flex justify-center mx-auto" />
                                                                </> : <>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-bg w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                                    </svg>
                                                                </>
                                                            }
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='desktop-login'>
                            <div className={`sm:fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`hidden sm:absolute inset-0 sm:flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in h-screen' : ''}`}>
                                <div className="bg-bg w-full max-w-md mx-auto rounded-xl shadow-lg text-center pb-2.5 border border-bg/50">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto' onClick={handleModal}>
                                            Connect your wallet
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-10'>
                                            <div className="mx-5 mt-2.5">
                                                <div>
                                                    {listedWallets.map((wallet) => (
                                                        <button
                                                            key={wallet.adapter.name}
                                                            onClick={() => connectWallet(wallet)}
                                                            className="mt-2.5 mb-2 flex items-center text-bg bg-white hover:opacity-80 text-[13px] font-[600] p-1.5 py-1.5 px-2.5 rounded-md w-full">
                                                            <Image src={wallet.adapter.icon} alt={`${wallet.adapter.name} logo`} width={27} height={27} className="rounded-full p-1" />
                                                            <span className="pl-1.5">{wallet.adapter.name}</span>
                                                            <span className="ml-auto" />
                                                            {wallet.adapter.connecting ?
                                                                <>
                                                                    <Spinner className="mt-0.5 w-4 h-4 spinner text-[#fff] animate-spin fill-green flex justify-center mx-auto" />
                                                                </> : <>
                                                                    <span className='font-[400] text-[8px] bg-[#2E303A20] text-[#000] rounded-md px-1.5 py-0.5 mr-1'>Detected</span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-bg w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                                    </svg>
                                                                </>
                                                            }
                                                        </button>
                                                    ))}
                                                    {collapsedWallets.map((wallet) => (
                                                        <button
                                                            key={wallet.adapter.name}
                                                            onClick={() => connectWallet(wallet)}
                                                            className="mt-2.5 mb-2 flex items-center text-bg bg-white hover:opacity-80 text-[13px] font-[600] p-1.5 py-1.5 px-2.5 rounded-md w-full">
                                                            <Image src={wallet.adapter.icon} alt={`${wallet.adapter.name} logo`} width={27} height={27} className="rounded-full p-1 bg-[#2E303A20]" />
                                                            <span className="pl-1.5">{wallet.adapter.name}</span>
                                                            <span className="ml-auto" />
                                                            {wallet.adapter.connecting ?
                                                                <>
                                                                    <Spinner className="mt-0.5 w-4 h-4 spinner text-[#fff] animate-spin fill-green flex justify-center mx-auto" />
                                                                </> : <>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-bg w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                                    </svg>
                                                                </>
                                                            }
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                </>
            </div>
        </>
    )
})

export default ConnectModal
