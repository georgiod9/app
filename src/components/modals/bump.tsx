import React, { forwardRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';

interface BumpModalProps {
    showModal: boolean;
    closeModal: () => void;
    tokenAddress: string,
    tokenTicker: string,
    tokenName: string,
    tokenImage: string,
    bot: number,
    duration: number,
    funding: number,
    fee: number,
}

const BumpModal = forwardRef<HTMLDivElement, BumpModalProps>(({ showModal, closeModal, tokenAddress, tokenName, tokenTicker, tokenImage, bot, duration, funding, fee }, ref) => {

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
        const sf = address.substring(address.length - 5)
        return `${pr}...${sf}`
    }

    return (
        <>
            <div ref={ref} className={`modal ${showModal ? 'block' : 'hidden'}`}>
                <>
                    <>
                        <div id='mobile-bump'>
                            <div className={`sm:hidden fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`sm:hidden fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in' : ''}`}>
                                <div className="bg-bg w-full max-w-md mx-auto rounded-xl shadow-lg text-center pb-2.5">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto'>
                                            Create a New Bump
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-10'>
                                            <div className="mx-5 mt-2.5">
                                                <div className='mt-5 mb-3 w-full'>
                                                    <div className='w-full flex flex-row row-span-2 bg-[#FFFFFF1A] py-2.5 px-2.5 mb-4 rounded-md text-sm'>

                                                        <div className='w-full text-[#FFFFFF80] font-[400] text-sm'>
                                                            <p className='flex text-start uppercase text-xs text-[#FFF] font-[550]'>Bump Details</p>
                                                            <div className='flex flex-row row-span-2 mt-1 text-xs'>
                                                                <div id='label' className='w-full text-start'>
                                                                    <p className='py-0.5'>Token:</p>
                                                                    <p className='py-0.5'>Address:</p>
                                                                    <p className='py-0.5'>Order:</p>
                                                                    <p className='py-0.5'>Bots:</p>
                                                                    <p className='py-0.5'>Freq:</p>
                                                                    <p className='py-0.5'>Expiry:</p>
                                                                </div>
                                                                <div id='data' className='w-full text-end'>
                                                                    <p className='text-white py-0.5 font-[600]'>{tokenName} [ticker: {tokenTicker}]</p>
                                                                    <p className='text-white py-0.5'>{formatAddress(tokenAddress)}</p>
                                                                    <p className='text-white py-0.5'>
                                                                        {bot == 3 && <>Light Bump</>}
                                                                        {bot == 10 && <>Keep it Bumping</>}
                                                                        {bot == 25 && <>Max Bumping</>}
                                                                    </p>
                                                                    <p className='py-0.5 text-white'>
                                                                        {bot == 3 && <>3 </>}
                                                                        {bot == 10 && <>10 </>}
                                                                        {bot == 25 && <>25 </>}
                                                                        Bots</p>
                                                                    <p className='py-0.5 text-white'>
                                                                        {bot == 3 && <>60 </>}
                                                                        {bot == 10 && <>30 </>}
                                                                        {bot == 25 && <>10 </>}
                                                                        sec</p>
                                                                    <p className='py-0.5 text-white'>{duration} hr</p>
                                                                </div>
                                                            </div>
                                                            <p className='mt-2 flex text-start uppercase text-xs text-[#FFF] font-[550]'>Bump Pricing</p>
                                                            <div className='flex flex-row row-span-2 text-start mt-1 text-xs'>
                                                                <div id='label' className='w-full text-start'>
                                                                    <p className='py-0.5'>Funding (redeemable)</p>
                                                                    <p className='py-0.5'>Services</p>
                                                                </div>
                                                                <div id='data' className='w-full text-end'>
                                                                    <p className='py-0.5 text-red'>{funding} SOL</p>
                                                                    <p className='py-0.5 text-red'>{fee} SOL</p>
                                                                </div>
                                                            </div>
                                                            <div className='py-1'>
                                                                <div className='border-t-[1px] border-[#FFFFFF1A]' />
                                                            </div>
                                                            <div className='flex flex-row row-span-2 text-start mt-0.5'>
                                                                <div id='label' className='w-[25%] text-start'>
                                                                    <p className='font-[500]'>Total:</p>
                                                                </div>
                                                                <div id='data' className='w-[75%] text-end'>
                                                                    <p className=' text-red'>{funding + fee} SOL</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80 block'>Create Bump</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='desktop-bump'>
                            <div className={`sm:fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`hidden sm:absolute inset-0 sm:flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in h-screen' : ''}`}>
                                <div className="bg-bg w-full max-w-3xl mx-auto rounded-xl shadow-lg text-center pb-2.5 border border-bg/50">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto'>
                                            Create a New Bump
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-10'>
                                            <div className="mx-5 mt-2.5">
                                                <div className='mt-5 mb-3 w-full'>
                                                    <div className='w-full flex flex-row row-span-2 bg-[#FFFFFF1A] py-2.5 px-2.5 mb-4 rounded-md text-sm'>
                                                        <div className='w-[40%] h-[237.5px]'>
                                                            <img src={tokenImage} style={{ width: '90%', height: '100%', objectFit: 'cover' }} alt={`${tokenName} token`} />
                                                        </div>
                                                        <div className='w-[60%] text-[#FFFFFF80] font-[400] text-sm'>
                                                            <p className='flex text-start uppercase text-xs text-[#FFF] font-[550]'>Bump Details</p>
                                                            <div className='flex flex-row row-span-2 mt-1 text-xs'>
                                                                <div id='label' className='w-[25%] text-start'>
                                                                    <p className='py-0.5'>Token:</p>
                                                                    <p className='py-0.5'>Address:</p>
                                                                    <p className='py-0.5'>Order:</p>
                                                                    <p className='py-0.5'>Bots:</p>
                                                                    <p className='py-0.5'>Freq:</p>
                                                                    <p className='py-0.5'>Expiry:</p>
                                                                </div>
                                                                <div id='data' className='w-[75%] text-end'>
                                                                    <p className='text-white py-0.5 font-[600]'>{tokenName} [ticker: {tokenTicker}]</p>
                                                                    <p className='text-white py-0.5'>{formatAddress(tokenAddress)}</p>
                                                                    <p className='text-white py-0.5'>
                                                                        {bot == 3 && <>Light Bump</>}
                                                                        {bot == 10 && <>Keep it Bumping</>}
                                                                        {bot == 25 && <>Max Bumping</>}
                                                                    </p>
                                                                    <p className='py-0.5 text-white'>
                                                                        {bot == 3 && <>3 </>}
                                                                        {bot == 10 && <>10 </>}
                                                                        {bot == 25 && <>25 </>}
                                                                        Bots</p>
                                                                    <p className='py-0.5 text-white'>
                                                                        {bot == 3 && <>60 </>}
                                                                        {bot == 10 && <>30 </>}
                                                                        {bot == 25 && <>10 </>}
                                                                        sec</p>
                                                                    <p className='py-0.5 text-white'>{duration} hr</p>
                                                                </div>
                                                            </div>
                                                            <p className='mt-2 flex text-start uppercase text-xs text-[#FFF] font-[550]'>Bump Pricing</p>
                                                            <div className='flex flex-row row-span-2 text-start mt-1 text-xs'>
                                                                <div id='label' className='w-[40%] text-start'>
                                                                    <p className='py-0.5'>Funding (redeemable)</p>
                                                                    <p className='py-0.5'>Services</p>
                                                                </div>
                                                                <div id='data' className='w-[60%] text-end'>
                                                                    <p className='py-0.5 text-red'>{funding} SOL</p>
                                                                    <p className='py-0.5 text-red'>{fee} SOL</p>
                                                                </div>
                                                            </div>
                                                            <div className='py-1'>
                                                                <div className='border-t-[1px] border-[#FFFFFF1A]' />
                                                            </div>
                                                            <div className='flex flex-row row-span-2 text-start mt-0.5'>
                                                                <div id='label' className='w-[25%] text-start'>
                                                                    <p className='font-[500]'>Total:</p>
                                                                </div>
                                                                <div id='data' className='w-[75%] text-end'>
                                                                    <p className=' text-red'>{funding + fee} SOL</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80 block'>Create Bump</button>
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

export default BumpModal
