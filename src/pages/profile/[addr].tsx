import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { WebsiteName, WebsiteSlogan, WebsiteURL } from '@/constants'
import Navbar from '@/components/navbar'
import { useWallet } from '@solana/wallet-adapter-react';
import Spinner from '@/utils/spinner';
import Image from 'next/image'

type OrderData = {
    id: number,
    owner: string,
    tokenAddress: string,
    tokenName: string,
    tokenTicker: string,
    tokenImage: string,
    botNbr: number,
    frequency: number,
    expiry: number,
    range: number[],
    funding: number,
    naming: boolean,
    replying: boolean,
    status: string,
    fee: number,
}

const Profile = () => {

    const router = useRouter()
    const { addr } = router.query as { addr: string }
    const { connected, publicKey } = useWallet()

    const [bumpData, setBumpData] = useState<OrderData[]>([]);
    const [bumpDataLoaded, setBumpDataLoaded] = useState(false)

    useEffect(() => {
        if (addr && connected && publicKey) {
            const base58 = publicKey.toBase58()
            if (addr == base58) {
                loadBumpers(addr)
            } else { router.push('/') }
        } else {
            router.push('/')
        }
    }, [addr, connected, publicKey])

    const orderDataExample = [
        {
            id: 0,
            owner: 'AzNUW1A2sMXhQeW1xgo9nwLLcE2fqYmP7tqdyMCSs2ib',
            tokenAddress: 'AzNUW1A2sMXhQeW1xgo9nwLLcE2fqYmP7tqdyMCSs2ib',
            tokenName: 'Alien Shiba',
            tokenTicker: 'ALIEN',
            tokenImage: 'https://cf-ipfs.com/ipfs/QmbuqiuKeNBhBhswTfAoPY2LUZqmhEtRmBrjTJkSGD3A2B',
            botNbr: 10,
            frequency: 30,
            expiry: 24,
            range: [0.001, 1.25],
            funding: 10,
            naming: true,
            replying: false,
            status: 'live',
            fee: 2,
        },
    ]

    async function loadBumpers(addr: any) {
        setTimeout(() => {
            setBumpDataLoaded(true)
            setBumpData(orderDataExample)
            // TODO - getOrderForAddress(addr)
        }, 500)
    }

    return (
        <>
            <Head>
                <title>{`${addr} | ` + WebsiteName}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={WebsiteSlogan} />
                <meta name="robots" content="follow, index" />
                <link rel="canonical" href={`${WebsiteURL}/profile/${addr}`} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${addr} | ` + WebsiteName} />
                <meta property="og:description" content={WebsiteSlogan} />
                <meta property="og:url" content={`${WebsiteURL}/profile/${addr}`} />
                <meta property="og:image" content={`${WebsiteURL}/og.jpg`} />
            </Head>
            <Navbar />
            <div className="md:flex md:flex-row md:row-span-2 items-center justify-center md:h-[100vh] mt-20 md:mt-0">
                <div className='flex justify-center mx-auto w-full md:w-1/2 pt-2 pb-5'>
                    <div id='bump-form' className='bg-[#2E303A] rounded-md md:w-[60%] w-full mx-4'>
                        <div className='mx-4 mt-3 mb-5'>
                            <h2 className='mb-4 text-lg italic font-light flex justify-start mx-auto'>
                                Pumbers
                            </h2>
                            {bumpDataLoaded ? <>
                                {bumpData.length > 0 ? <>
                                    <div id='user-bump'>
                                        {bumpData.map((data, index) => (
                                            <div key={index} className='w-full rounded-md bg-[#FFFFFF1A] my-2.5 px-2 py-2'>
                                                <div className='h-fit w-full items-center block'>
                                                    <div className='flex justify-between mx-auto w-full'>
                                                        <span className='text-[#FFF] text-xs md:text-sm font-[600]'>{data.tokenName} [ticker: {data.tokenTicker}]</span>
                                                        <button onClick={() => alert('openEditModal')} className='text-[#FFF] text-xs md:text-sm font-[400] hover:opacity-80'>[Edit]</button>
                                                    </div>
                                                    <div className='mt-2.5 flex flex-row row-span-2 h-fit'>
                                                        <div className='w-1/3 md:w-1/2 h-[90px] md:h-[180px]'>
                                                            {/* <Image src={data.tokenImg} width={100} height={100} alt={`${data.tokenName} token`} fetchPriority='auto' className='w-[85%] h-fit' /> */}
                                                            <img src={data.tokenImage} style={{ width: '85%', height: '100%', objectFit: 'cover' }} alt={`${data.tokenName} token`} />
                                                        </div>
                                                        <div className='w-2/3 md:w-1/2 text-[#FFFFFF80] font-[400] text-sm'>
                                                            <div className='flex flex-row row-span-2'>
                                                                <div id='name'>
                                                                    <p>Bots:</p>
                                                                    <p>Freq:</p>
                                                                    <p>Expiry:</p>
                                                                    <p>Fund:</p>
                                                                    <p>Range:</p>
                                                                    <p>Naming:</p>
                                                                    <p>Replying:</p>
                                                                </div>
                                                                <div id='data' className='mx-1 md:mx-2.5'>
                                                                    <p>{data.botNbr} Bots</p>
                                                                    <p>{data.frequency} sec</p>
                                                                    <p>{data.frequency} hr</p>
                                                                    <p>{data.funding} SOL</p>
                                                                    <p>{data.range[0]}-{data.range[1]} SOL</p>
                                                                    <p>{data.naming == true ? <>true</> : <>false</>}</p>
                                                                    <p>{data.replying == true ? <>true</> : <>false</>}</p>
                                                                </div>
                                                            </div>
                                                            {data.status == 'live' && <>
                                                                <div className='flex mt-2.5 items-center gap-x-1'>
                                                                    <button className='w-[90%] bg-white text-bg text-xs py-1.5 rounded-md'>
                                                                        Withdraw
                                                                    </button>
                                                                    <div className='w-[10%]'>
                                                                        <div className='flex justify-center mx-auto'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                                                                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>}
                                                            {data.status == 'finished' && <></>}
                                                            {data.status == 'canceled' && <></>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                    <div className='mt-4 mb-2.5'>
                                        <button id='mobile-bump'
                                            // onClick={() => handleBumpModal()} 
                                            className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80 md:hidden block'>+ Add New Bump</button>
                                        <button id='desktop-bump' onClick={() => router.push('/')} className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80 hidden md:block'>+ Add New Bump</button>
                                    </div>
                                </> : <>
                                    <div id='no-bump' className='w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-2 px-2 py-2 flex items-center justify-center'>
                                        <div className='text-[#FFF] text-xs md:text-sm text-center w-full'>
                                            <span className='font-[600]'>No Pumbers yet!</span>
                                            <div className='mt-10 flex justify-center mx-auto'>
                                                <button id='mobile-bump'
                                                    // onClick={() => handleBumpModal()} 
                                                    className='text-bg bg-green w-[80%] rounded-md py-3 hover:opacity-80 md:hidden block'>+ Add New Bump</button>
                                                <button id='desktop-bump' onClick={() => router.push('/')} className='text-bg bg-green w-[60%] rounded-md py-3 hover:opacity-80 hidden md:block'>+ Add New Bump</button>
                                            </div>
                                        </div>
                                    </div>
                                </>}
                            </> : <>
                                <>
                                    <div id='bump-data-loading' className='w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-2 px-2 py-2 flex items-center justify-center'>
                                        <div className='flex text-center mx-auto justify-center w-full'>
                                            <Spinner className="w-8 h-8 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                        </div>
                                    </div>
                                </>
                            </>}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Profile
