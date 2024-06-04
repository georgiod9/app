import React, { forwardRef, useEffect } from 'react';

interface HowItWorksModalProps {
    showModal: boolean;
    closeModal: () => void;
}

const HowItWorksModal = forwardRef<HTMLDivElement, HowItWorksModalProps>(({ showModal, closeModal }, ref) => {

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
                        <div id='mobile-signout'>
                            <div className={`sm:hidden fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`sm:hidden fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in' : ''}`}>
                                <div className="bg-bg w-full max-w-md mx-auto rounded-xl shadow-lg text-center pb-2.5">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl absolute font-light flex justify-center mx-auto'>
                                            How it works
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-14 px-2.5'>
                                            <p className='text-start text-sm font-[400] text-red py-1.5 px-2.5 rounded-md'>
                                                We create multiple wallets to keep on bumping your token through micro buys/sells.
                                            </p>
                                            <p className='mt-0.5 text-start text-sm font-[400] text-red py-1.5 px-2.5 rounded-md'>
                                                The buys are more than the sells, we do sells just to keep funds in the wallets and not have them run out of funds.
                                            </p>
                                            <div className='my-2.5 px-2.5'>
                                                <div className='bg-[#FFFFFF1A] py-1.5 px-3 rounded-md'>
                                                    <p className='pt-1.5 text-start text-sm font-[400] text-[#FFFFFF80] rounded-md'>
                                                        Getting started:
                                                    </p>
                                                    <ul className='ml-8 list-decimal text-white text-start text-sm py-2'>
                                                        <li className=''>Select the number of wallets to bump your token. Each package has different number of wallets and different buy/sell frequency.</li>
                                                        <li className='my-2'>Insert the token address.</li>
                                                        <li className='my-2'>Insert the amount in SOL to fund your wallets with. Note that at the end of the bumping cycle the wallets will withdraw the tokens and remaining SOL back to your wallet. </li>
                                                        <li className='my-2'>Select the number of days to Bump the token. Each day costs more, as if buying the package again.</li>
                                                        <li className='text-green underline'>Start Bumping!</li>
                                                    </ul>
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
                                <div className="bg-bg w-full max-w-[570px] mx-auto rounded-xl shadow-lg text-center pb-2.5 border border-bg/50">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl absolute font-light flex justify-center mx-auto'>
                                            How it works
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        <div className='w-full mt-14 px-2.5'>
                                            <p className='text-start text-sm font-[400] text-red py-1.5 px-2.5 rounded-md'>
                                                We create multiple wallets to keep on bumping your token through micro buys/sells.
                                            </p>
                                            <p className='mt-0.5 text-start text-sm font-[400] text-red py-1.5 px-2.5 rounded-md'>
                                                The buys are more than the sells, we do sells just to keep funds in the wallets and not have them run out of funds.
                                            </p>
                                            <div className='my-2.5 px-2.5'>
                                                <div className='bg-[#FFFFFF1A] py-1.5 px-3 rounded-md'>
                                                    <p className='pt-1.5 text-start text-sm font-[400] text-[#FFFFFF80] rounded-md'>
                                                        Getting started:
                                                    </p>
                                                    <ul className='ml-8 list-decimal text-white text-start text-sm py-2'>
                                                        <li className=''>Select the number of wallets to bump your token. Each package has different number of wallets and different buy/sell frequency.</li>
                                                        <li className='my-2'>Insert the token address.</li>
                                                        <li className='my-2'>Insert the amount in SOL to fund your wallets with. Note that at the end of the bumping cycle the wallets will withdraw the tokens and remaining SOL back to your wallet. </li>
                                                        <li className='my-2'>Select the number of days to Bump the token. Each day costs more, as if buying the package again.</li>
                                                        <li className='text-green underline'>Start Bumping!</li>
                                                    </ul>
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

export default HowItWorksModal
