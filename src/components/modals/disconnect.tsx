import React, { forwardRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';

interface DisconnectModalProps {
    showModal: boolean;
    closeModal: () => void;
    addr: string;
}

const DisconnectModal = forwardRef<HTMLDivElement, DisconnectModalProps>(({ showModal, closeModal, addr }, ref) => {

    const { disconnect } = useWallet()
    const router = useRouter()

    async function quit() {
        await disconnect()
        handleModal()
        router.push('/')
    }

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

    function formatAddress(address: string) {
        const pr = address.substring(0, 5)
        const sf = address.substring(address.length - 3)
        return `${pr}...${sf}`
    }

    return (
        <>
            <div ref={ref} className={`modal ${showModal ? 'block' : 'hidden'}`}>
                <>
                    <>
                        <div id='mobile-signout'>
                            <div className={`sm:hidden fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`sm:hidden fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in' : ''}`}>
                                <div className="bg-bg w-full max-w-md mx-auto rounded-xl shadow-lg text-center pb-2.5">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto'>
                                            {formatAddress(addr)}
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-10'>
                                            <div className="mx-5 mt-2.5">
                                                <div className=''>
                                                    <div className='mt-5 mb-3 w-full'>
                                                        <div className='w-full bg-[#FFFFFF1A] py-2.5 px-2.5 rounded-md'>
                                                            <p className='text-white bg-bg w-full rounded-md text-[10px] text-start px-2 py-2 border border-white'>{addr}</p>
                                                        </div>
                                                    </div>
                                                    <div className='mt-5 mb-2'>
                                                        <button onClick={() => quit()} className='text-bg bg-white w-full rounded-md text-[16px] py-2 hover:opacity-80'>Disconnect Wallet</button>
                                                    </div>
                                                    {router.pathname.startsWith('/profile') ? <></> : <>
                                                        <span onClick={() => router.push(`/profile/${addr}`)} className='mt-4 mb-1.5 font-light hover:text-white/80 text-sm w-full justify-center mx-0 flex'>[View Profile]</span>
                                                    </>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='desktop-signout'>
                            <div className={`sm:fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`hidden sm:absolute inset-0 sm:flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in h-screen' : ''}`}>
                                <div className="bg-bg w-full max-w-md mx-auto rounded-xl shadow-lg text-center pb-2.5 border border-bg/50">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto'>
                                            {formatAddress(addr)}
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-10'>
                                            <div className="mx-5 mt-2.5">
                                                <div className=''>
                                                    <div className='mt-5 mb-3 w-full'>
                                                        <div className='w-full bg-[#FFFFFF1A] py-2.5 px-2.5 rounded-md'>
                                                            <p className='text-white bg-bg w-full rounded-md text-xs text-start px-2 py-2 border border-white'>{addr}</p>
                                                        </div>
                                                    </div>
                                                    <div className='mt-5 mb-2'>
                                                        <button onClick={() => quit()} className='text-bg bg-white w-full rounded-md text-[16px] py-2 hover:opacity-80'>Disconnect Wallet</button>
                                                    </div>
                                                    {router.pathname.startsWith('/profile') ? <></> : <>
                                                        <span onClick={() => router.push(`/profile/${addr}`)} className='mt-4 mb-1.5 font-light hover:text-white/80 text-sm w-full justify-center mx-0 flex'>[View Profile]</span>
                                                    </>}
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

export default DisconnectModal
