import { forwardRef, Key, useEffect, useState } from 'react';
import { type OrderStateData } from '@/utils/types';
import Spinner from '@/utils/spinner';
import * as solWeb3 from "@solana/web3.js";
import { SOLANA, RPC } from '@/constants';
//import * as SPLToken from '@solana/spl-token';
import axios from 'axios';
import { orderStateDataExample } from '@/utils/examples_data';
import { IWallet } from '@/utils/interfaces'

interface OrderStateModalProps {
    showModal: boolean;
    closeModal: () => void;
    id: number;
    token: string
    status: string;
}

const OrderStateModal = forwardRef<HTMLDivElement, OrderStateModalProps>(({ showModal, closeModal, id, token, status }, ref) => {

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

    const [orderStateLoaded, setOrderStateLoaded] = useState(false)
    const [OrderStateData, setOrderStateData] = useState<OrderStateData[]>([])
    const [errorLoadingData, setErrorLoadingData] = useState(false)

    const [SOLBalance, setSOLBalance] = useState<any>([])
    const [SOLBalanceLoading, setSOLBalanceLoading] = useState(false)
    const [TokenBalance, setTokenBalance] = useState<any>([])
    const [TokenBalanceLoading, setTokenBalanceLoading] = useState(false)

    useEffect(() => {
        const getSolBalances = async () => {
            const balances = OrderStateData.map(async (data) => {
                const bal = data.pk.map(async (v) => {
                    const balance = await getSolBal(v)
                    return balance
                })
                const balances = await Promise.all(bal)
                return balances
            });
            const solbals = await Promise.all(balances)
            setSOLBalance(solbals)
            setSOLBalanceLoading(false)
        }
        const getTokenBalances = async () => {
            const balances = OrderStateData.map(async (data) => {
                const bal = data.pk.map(async (v) => {
                    const balance = await getTokenBal(v, token)
                    return balance
                })
                const balances = await Promise.all(bal)
                return balances
            });
            const tknbals = await Promise.all(balances)
            setTokenBalance(tknbals)
            setTokenBalanceLoading(false)
            //setTokenBalanceLoading(true)
        }
        if (OrderStateData.length > 0) {
            getSolBalances()
            getTokenBalances()
        }
    }, [OrderStateData])


    async function loadOrder(id: number) {
        setOrderStateLoaded(false)
        let data = [] as IWallet[]
        let i = 0
        const encodedID = encodeURIComponent(id);
        const res = await fetch(`/api/ow/${encodedID}`);
        if (!res.ok) {
            setErrorLoadingData(true)
            throw new Error('Failed to fetch wallets')
        }
        const walletsdata = await res.json()
        console.log(res)
        console.log("no", walletsdata)
        console.log("pk", walletsdata.pk)
        setOrderStateLoaded(true)
        // setOrderStateData(walletsdata)
        setOrderStateData(orderStateDataExample)
    }

    useEffect(() => {
        if (status != 'pending')
            loadOrder(id)
    }, [id, status])

    async function getSolBal(address: string) {
        const pk = new solWeb3.PublicKey(address)
        const bal = await SOLANA.getBalanceAndContext(pk)
        const fbal = balanceToStr(bal.value)
        return fbal
    }

    const balanceToStr = (balNbr: number) => {
        const balance = balNbr / (10 ** 9)
        const strBalance = balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        const mainStrBalance = strBalance.replace(',', '.')
        return mainStrBalance
    };

    async function getTokenBal(address: string, token: string) {
        const res = await axios({
            url: `${RPC}`,
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {
                jsonrpc: "2.0",
                id: 1,
                method: "getTokenAccountsByOwner",
                params: [
                    address,
                    {
                        mint: token,
                    },
                    {
                        encoding: "jsonParsed",
                    },
                ],
            },
        })
        let bal
        if (res.data.result.value[0])
            bal = res.data.result.value[0].account.data.parsed.info.tokenAmount.uiAmount
        else bal = 0
        return bal
    }

    return (
        <>
            <div ref={ref} className={`modal ${showModal ? 'block' : 'hidden'}`}>
                <>
                    <>
                        <div id='order-state'>
                            <div className={`sm:fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`} />
                            <div className={`hidden sm:absolute inset-0 sm:flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${showModal ? 'slide-in h-screen' : ''}`}>
                                <div className="bg-bg w-full max-w-3xl mx-auto rounded-xl shadow-lg text-center pb-2.5 border border-bg/50">
                                    <div className="relative flex flex-col items-center">
                                        <div className='left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto'>
                                            Order #{id} Details
                                        </div>
                                        <div className='right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80' onClick={handleModal}>
                                            [Close]
                                        </div>
                                        {status != 'pending' ? <>
                                            {!errorLoadingData && orderStateLoaded ? <>
                                                <div className='w-full mt-10'>
                                                    <div className="mx-5 mt-2.5">
                                                        <div className='mt-5 mb-3 w-full'>
                                                            <div className='w-full bg-[#FFFFFF1A] py-2.5 px-2.5 rounded-md text-sm'>
                                                                <div id='titles' className='flex flex-row row-span-4'>
                                                                    <div id='wallets' className='w-1/4 text-start'>
                                                                        <p className='text-white/50'>Bot Address</p>
                                                                        {OrderStateData.map((data, index) => (
                                                                            <div key={index}>
                                                                                {data.pk.map((v, i) => (
                                                                                    <p key={i} className='text-white/85 py-0.5'>
                                                                                        {formatAddress(v)}
                                                                                    </p>
                                                                                ))}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div id='sol-bal' className='w-1/4 text-start'>
                                                                        <p className='text-white/50'>Sol Balance</p>
                                                                        {SOLBalanceLoading ? <>
                                                                            {OrderStateData.map((data, index) => (
                                                                                <div key={index}>
                                                                                    {data.pk.map((v, i) => (
                                                                                        <p key={i} className='text-white/85 py-[5.75px]'>
                                                                                            <Spinner className="w-3 h-3 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                                                                        </p>
                                                                                    ))}
                                                                                </div>
                                                                            ))}
                                                                        </> : <>
                                                                            {SOLBalance.map((data: any[], index: Key | null | undefined) => (
                                                                                <div key={index}>
                                                                                    {data.map((balance, i) => (
                                                                                        <p key={i} className='text-white/85 py-0.5'>
                                                                                            {balance}
                                                                                        </p>
                                                                                    ))}
                                                                                </div>
                                                                            ))}
                                                                        </>
                                                                        }
                                                                    </div>
                                                                    <div id='token-bal' className='w-1/4 text-start'>
                                                                        <p className='text-white/50'>Token Balance</p>
                                                                        {TokenBalanceLoading ? <>
                                                                            {OrderStateData.map((data, index) => (
                                                                                <div key={index}>
                                                                                    {data.pk.map((v, i) => (
                                                                                        <p key={i} className='text-white/85 py-[5.75px]'>
                                                                                            <Spinner className="w-3 h-3 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                                                                        </p>
                                                                                    ))}
                                                                                </div>
                                                                            ))}
                                                                        </> : <>
                                                                            {TokenBalance.map((data: any[], index: Key | null | undefined) => (
                                                                                <div key={index}>
                                                                                    {data.map((balance, i) => (
                                                                                        <p key={i} className='text-white/85 py-0.5'>
                                                                                            {balance}
                                                                                        </p>
                                                                                    ))}
                                                                                </div>
                                                                            ))}
                                                                        </>
                                                                        }
                                                                    </div>
                                                                    <div id='state' className='w-1/4 text-end'>
                                                                        <p className='text-white/50'>Explore</p>
                                                                        {OrderStateData.map((data, index) => (
                                                                            <div key={index}>
                                                                                {data.pk.map((v, i) => (
                                                                                    <p key={i} className='text-white/85 py-0.5 hover:opacity-80'>
                                                                                        <a href={`https://solscan.io/account/${v}`} target='_blank'>
                                                                                            View on solscan ↗
                                                                                        </a>
                                                                                    </p>
                                                                                ))}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : <>
                                                {!errorLoadingData && !orderStateLoaded && <div className='w-full mt-10'>
                                                    <div className="mx-5 mt-2.5">
                                                        <div className='mt-5 mb-3 w-full'>
                                                            <div className='w-full bg-[#FFFFFF1A] py-2.5 px-2.5 rounded-md text-sm'>
                                                                <div className='flex text-center mx-auto justify-center w-full'>
                                                                    <Spinner className="w-5 h-5 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>}
                                                {errorLoadingData && !orderStateLoaded && <div className='w-full mt-10'>
                                                    <div className="mx-5 mt-2.5">
                                                        <div className='mt-5 mb-3 w-full'>
                                                            <div className='w-full bg-[#FFFFFF1A] py-2.5 px-2.5 rounded-md text-sm'>
                                                                <div className='flex text-center text-xs mx-auto justify-center w-full'>
                                                                    <p className='text-red'>Unable to load bumpers. Please try again.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>}
                                            </>}
                                        </> : <>
                                            <div className='w-full mt-10'>
                                                <div className="mx-5 mt-2.5">
                                                    <div className='mt-5 mb-3 w-full'>
                                                        <div className='w-full bg-[#FFFFFF1A] py-10 px-2.5 rounded-md'>
                                                            <div className='flex text-center text-xs mx-auto justify-center w-full'>
                                                                <p className='text-[#FFFFFF80]'>Unable to load state for a <span className='text-yellow'>Pending</span> order. Please try again in some minutes.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>}
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

export default OrderStateModal
