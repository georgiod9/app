import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { WebsiteName, WebsiteSlogan, WebsiteURL } from '@/constants'
import Navbar from '@/components/navbar'
import { useWallet } from '@solana/wallet-adapter-react';
import Spinner from '@/utils/spinner';
import QModal from '@/components/utils/hoverpr';
//import { BlockTimestamp } from '@solana/web3.js'
import { solana } from '@/constants'
import { type OrderData, type OrderStateModalRefType, type BumpModalRefType } from '@/utils/types'
import BumpModal from '@/components/modals/bump'
import OrderStateModal from '@/components/modals/state'
import { orderDataExample } from '@/utils/examples_data'

const Profile = () => {

    const router = useRouter()
    const { addr } = router.query as { addr: string }
    const { connected, publicKey } = useWallet()

    const [bumpData, setBumpData] = useState<OrderData[]>([]);
    const [bumpDataLoaded, setBumpDataLoaded] = useState(false)

    const [QModalOpen, setQModalOpen] = useState(false)
    const [QModalOpen1, setQModalOpen1] = useState(false)

    const [solanaTimestamp, setSolanaTimestamp] = useState(0)

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

    async function getSolTimestamp() {
        const slot = await solana.getSlot()
        const timestamp = await solana.getBlockTime(slot)
        if (timestamp != null) {
            setSolanaTimestamp(timestamp)
        } else {
            setTimeout(() => {
                getSolTimestamp()
            }, 1500)
        }
    }

    useEffect(() => {
        if (solanaTimestamp == 0)
            getSolTimestamp()
    }, [solanaTimestamp])

    const formatTimestamp = (timestamp: number): string => {
        const date = new Date(timestamp * 1000)
        const ymd: Intl.DateTimeFormatOptions = {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        }
        const hms: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }
        return date.toLocaleDateString(undefined, ymd) + '-' + date.toLocaleTimeString(undefined, hms)
    };


    async function loadBumpers(addr: any) {
        setTimeout(() => {
            setBumpDataLoaded(true)
            setBumpData(orderDataExample)
            // TODO - getOrderForAddress(addr)
        }, 1500)
    }

    const [tokenAddress, setTokenAddress] = useState('')
    const [orderStateId, setOrderStateId] = useState(0)
    const [orderStatus, setOrderStatus] = useState('')
    const OrderStateModalRef = useRef<OrderStateModalRefType>(null)
    const [isOrderStateModalOpen, setOrderStateModalOpen] = useState(false)

    const handleOrderStateModal = () => {
        setOrderStateModalOpen(prevState => !prevState)
    }

    const setPropsAndHandleOrderStateModal = (id: number, token: string, status: string) => {
        if (!isOrderStateModalOpen) {
            setOrderStateId(id)
            setOrderStatus(status)
            setTokenAddress(token)
            setOrderStateModalOpen(prevState => !prevState)
        } else {
            setOrderStateModalOpen(prevState => !prevState)
        }
    }

    const [tokenName, setTokenName] = useState('')
    const [tokenTicker, setTokenTicker] = useState('')
    const [tokenImage, setTokenImage] = useState('')
    const [bumpPackage, setBumpPackage] = useState(0)
    const [duration, setDuration] = useState(0)
    const [funding, setFunding] = useState(0)
    const [fee, setFee] = useState(0)

    const BumpModalRef = useRef<BumpModalRefType>(null)
    const [isBumpModalOpen, setBumpModalOpen] = useState(false)

    const handleBumpModal = () => {
        setBumpModalOpen(prevState => !prevState)
    }

    const setPropsAndHandleBumpModal = (token: string, name: string, ticker: string, image: string, pack: number, duration: number, funding: number, fee: number) => {
        if (!isBumpModalOpen) {
            setTokenAddress(token)
            setTokenName(name)
            setTokenTicker(ticker)
            setTokenImage(image)
            setBumpPackage(pack)
            setDuration(duration)
            setFunding(funding)
            setFee(fee)
            setBumpModalOpen(prevState => !prevState)
        } else {
            setBumpModalOpen(prevState => !prevState)
        }
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
            <div className="md:h-[100vh] mt-20 md:mt-0 md:flex items-center justify-center md:max-w-xl lg:max-w-2xl md:mx-auto mx-2.5">
                <div className="block w-full justify-center mt-2.5 md:mt-0 mb-10 md:mb-0 md:max-w-xl lg:max-w-6xl md:mx-auto ">
                    <div className='flex justify-center mx-auto w-full'>
                        <div id='bump-form' className='bg-[#2E303A] rounded-md w-full'>
                            <div className='lg:mx-7 md:mx-4 mx-2.5'>
                                <h2 className='lg:my-5 md:my-4 my-2 text-lg italic font-light flex justify-start mx-auto'>
                                    Bumpers
                                </h2>
                                {bumpDataLoaded ? <>
                                    {bumpData.length > 0 ? <>
                                        <div id='user-bump' style={{ maxHeight: '530px', overflowY: 'auto' }}>
                                            {bumpData.map((data, index) => (
                                                <div key={index} className='w-full rounded-md bg-[#FFFFFF1A] mt-3 md:mt-2 lg:mt-0 px-2 py-2 my-2.5 md:my-4'>
                                                    <div className='h-fit w-full items-center block sm:px-1.5 py-1'>
                                                        <div className='flex justify-between mx-auto w-full'>
                                                            <span className='text-[#FFF] text-xs md:text-sm font-[600]'>{data.tokenName} [ticker: {data.tokenTicker}]</span>
                                                            <button onClick={() => setPropsAndHandleOrderStateModal(data.id, data.tokenAddress, data.status)} className='hidden sm:block text-[#FFF] text-xs md:text-sm font-extralight hover:opacity-80'>[Infos]</button>
                                                        </div>
                                                        <div className='mt-2.5 flex flex-row row-span-2 h-fit'>
                                                            <div className='w-1/3 md:w-[40%] h-[90px] md:h-[180px]'>
                                                                <img src={data.tokenImage} style={{ width: '85%', height: '100%', objectFit: 'cover' }} alt={`${data.tokenName} token`} />
                                                            </div>
                                                            <div className='w-2/3 md:w-[60%] text-[#FFFFFF80] font-[400] text-sm'>
                                                                <div className='flex flex-row row-span-2'>
                                                                    <div id='name'>
                                                                        <p>Order:</p>
                                                                        <p>Bots:</p>
                                                                        <p>Freq:</p>
                                                                        <p>Expiry:</p>
                                                                        <p>Fund:</p>
                                                                        <p>Status:</p>
                                                                        <p>Placed:</p>
                                                                    </div>
                                                                    <div id='data' className='mx-1 md:mx-2.5'>
                                                                        <p className='text-white'>
                                                                            {data.bumpPackage == 1 && <>Light Bump</>}
                                                                            {data.bumpPackage == 2 && <>Keep it Bumping</>}
                                                                            {data.bumpPackage == 3 && <>Max Bumping</>}
                                                                        </p>
                                                                        <p>{data.botNbr} Bots</p>
                                                                        <p>{data.frequency} sec</p>
                                                                        <p>{data.duration} hr</p>
                                                                        <p>{data.funding} SOL</p>
                                                                        <p>
                                                                            {data.status == 'pending' && <span className='text-yellow'>Pending</span>}
                                                                            {data.status == 'live' && <span className='text-green'>Running</span>}
                                                                            {data.status == 'canceled' && <span className='text-red'>Canceled</span>}
                                                                            {data.status == 'finished' && <span className='text-blue'>Expired</span>}
                                                                        </p>
                                                                        <p>{formatTimestamp(data.placed)}</p>
                                                                    </div>
                                                                </div>
                                                                {data.status == 'live' && <>
                                                                    <div className='flex relative mt-1.5 items-center gap-x-1'>
                                                                        <button onClick={() => alert('cancelModal or directTx?')} className='sm:w-[90%] w-full bg-white text-bg text-xs py-2 rounded-md'>
                                                                            Cancel & Withdraw
                                                                        </button>
                                                                        <span className='w-[10%] hidden sm:flex justify-center items-center'>
                                                                            <div className='absolute'>
                                                                                {QModalOpen && <QModal text='Bots will sell the tokens and withdraw the SOL to your wallet.' w={155} />}
                                                                                <svg
                                                                                    onMouseEnter={() => setQModalOpen(true)}
                                                                                    onMouseLeave={() => setQModalOpen(false)}
                                                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[20px] md:h-[20px] opacity-50 hover:opacity-100 pt-0.5">
                                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </div>
                                                                        </span>
                                                                    </div>
                                                                </>}
                                                                {data.status == 'pending' && <>
                                                                    <div className='flex relative mt-1.5 items-center gap-x-1'>
                                                                        <button disabled className='sm:w-[90%] w-full bg-[#FFFFFF1A] text-[#FFFFFF80] text-xs py-2 rounded-md'>
                                                                            Cancel & Withdraw
                                                                        </button>
                                                                        <span className='w-[10%] hidden sm:flex justify-center items-center'>
                                                                            <div className='absolute'>
                                                                                {QModalOpen1 && <QModal text='Order can only be canceled while running.' w={150} />}
                                                                                <svg
                                                                                    onMouseEnter={() => setQModalOpen1(true)}
                                                                                    onMouseLeave={() => setQModalOpen1(false)}
                                                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[20px] md:h-[20px] opacity-50 hover:opacity-100 pt-0.5">
                                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </div>
                                                                        </span>
                                                                    </div>
                                                                </>}
                                                                {data.status == 'canceled' && <>
                                                                    <div className='flex relative mt-1.5 items-center gap-x-1'>
                                                                        <button disabled className='sm:w-[95%] w-full bg-[#FFFFFF1A] text-[#FFFFFF80] text-xs py-2 rounded-md'>
                                                                            Canceled
                                                                        </button>
                                                                    </div>
                                                                </>}
                                                                {data.status == 'finished' && <>
                                                                    <div className='flex relative mt-1.5 items-center gap-x-1'>
                                                                        <button id='desktop-renew' onClick={() => setPropsAndHandleBumpModal(data.tokenAddress, data.tokenName, data.tokenTicker, data.tokenImage, data.bumpPackage, data.duration, data.funding, data.fee)} className='w-[95%] hidden sm:block bg-white text-bg text-xs py-2 rounded-md'>
                                                                            Renew
                                                                        </button>
                                                                        <button id='mobile-renew' onClick={() => router.push('/')} className='w-full sm:hidden bg-white text-bg text-xs py-2 rounded-md'>
                                                                            Renew
                                                                        </button>
                                                                    </div>
                                                                </>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </> : <>
                                        <div id='no-bump' className='w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-3 md:mt-2 lg:mt-0 px-2 py-2 my-2.5 md:my-4 lg:my-7 flex items-center justify-center'>
                                            <div className='text-[#FFF] text-xs md:text-sm text-center w-full'>
                                                <span className='font-[600]'>No Bumpers yet!</span>
                                                <div className='mt-10 flex justify-center mx-auto'>
                                                    <button id='mobile-bump-btn' onClick={() => router.push('/')} className='text-bg bg-green w-[80%] rounded-md py-3 hover:opacity-80 md:hidden block'>+ Add New Bump</button>
                                                    <button id='desktop-bump-btn' onClick={() => router.push('/')} className='text-bg bg-green w-[60%] rounded-md py-3 hover:opacity-80 hidden md:block'>+ Add New Bump</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                                </> : <>
                                    <>
                                        <div id='bump-data-loading' className='w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-3 md:mt-2 lg:mt-0 px-2 py-2 my-2.5 md:my-4 lg:my-7 flex items-center justify-center'>
                                            <div className='flex text-center mx-auto justify-center w-full'>
                                                <Spinner className="w-8 h-8 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                            </div>
                                        </div>
                                    </>
                                </>}
                            </div>
                        </div>
                    </div>
                    {bumpDataLoaded && bumpData.length > 0 && <>
                        <div className='mt-4 mb-2.5'>
                            <div className='bg-[#2E303A] rounded-md w-full lg:px-7 md:p-4 p-2.5'>
                                <button id='mobile-bump-btn' onClick={() => router.push('/')} className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80 md:hidden block'>+ Add New Bump</button>
                                <button id='desktop-bump-btn' onClick={() => router.push('/')} className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80 hidden md:block'>+ Add New Bump</button>
                            </div>
                        </div>
                    </>}
                </div>
            </div>
            <>
                {isOrderStateModalOpen && <><OrderStateModal showModal={isOrderStateModalOpen} closeModal={handleOrderStateModal} ref={OrderStateModalRef} id={orderStateId} token={tokenAddress} status={orderStatus} /></>}
            </>
            <>
                {isBumpModalOpen && <><BumpModal showModal={isBumpModalOpen} closeModal={handleBumpModal} ref={BumpModalRef} tokenAddress={tokenAddress} tokenName={tokenName} tokenTicker={tokenTicker} tokenImage={tokenImage} bumpPackage={bumpPackage} duration={duration} funding={funding} fee={fee} /></>}
            </>
        </>
    )
}

export default Profile
