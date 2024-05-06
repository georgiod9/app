'use client'
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Spinner from '@/utils/spinner';
import ConnectModal from '@/components/modals/connect';
import DisconnectModal from '@/components/modals/disconnect';
import { solana } from '@/constants';
import { useWallet, type Wallet } from '@solana/wallet-adapter-react';

type ConnectModalRefType = HTMLDivElement | null
type DiconnectModalRefType = HTMLDivElement | null

const Connector = () => {

    const router = useRouter()
    const { connected, publicKey } = useWallet()

    const [bal, setBal] = useState<string | null>('')
    const [address, setAddress] = useState<string | null>('')
    const [faddress, setFAddress] = useState<string | null>('')

    useEffect(() => {
        const getSolBal = async (publicKey: any) => {
            if (publicKey) {
                const bal = await solana.getBalanceAndContext(publicKey)
                const fbal = balanceToStr(bal.value)
                setBal(fbal)
            } else {
                return
            }
        }
        if (connected && publicKey) {
            formatAddr(publicKey)
            getSolBal(publicKey)
        } else { return }
    }, [connected, publicKey])

    const balanceToStr = (balNbr: number) => {
        const balance = balNbr / (10 ** 9)
        const strBalance = balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        const mainStrBalance = strBalance.replace(',', '.')
        return mainStrBalance;
    };

    const formatAddr = (publicKey: any) => {
        const base58 = publicKey.toBase58()
        const formatted = base58.slice(0, 4) + '...' + base58.slice(-4)
        setAddress(base58)
        setFAddress(formatted)
    }

    const ConnectModalRef = useRef<ConnectModalRefType>(null)
    const [isConnectModalOpen, setConnectModalOpen] = useState(false)

    const handleConnectModal = () => {
        setConnectModalOpen(prevState => !prevState)
    }

    const DisconnectModalRef = useRef<DiconnectModalRefType>(null)
    const [isDisconnectModalOpen, setDisconnectModalOpen] = useState(false)

    const handleDisconnectModal = () => {
        setDisconnectModalOpen(prevState => !prevState)
    }

    return (
        <>
            {connected ? <>
                <div className='w-full'>
                    <div className='flex'>
                        <div className='hidden md:flex md:pr-4'>
                            {router.pathname.startsWith('/profile') ? <>
                                <span onClick={() => router.push(`/`)} className='pt-1 font-light hover:text-white/80 text-xs w-full justify-end mx-0 flex'>[Go Home]</span>
                            </> : <>
                                <span onClick={() => router.push(`/profile/${address}`)} className='pt-1 font-light hover:text-white/80 text-xs w-full justify-end mx-0 flex'>[View Profile]</span>
                            </>}
                        </div>
                        <div onClick={() => handleDisconnectModal()} className='border block border-white rounded-md hover:opacity-80'>
                            <div className='flex text-xs font-light p-1 px-2.5 items-center m-auto'>
                                {bal ? <span className='flex '>({bal} SOL)</span> : <><Spinner className="w-[12px] h-[12px] spinner text-[#FFFFFF80] animate-spin fill-white mr-1" /></>}
                                <span className='ml-1'>{faddress}</span>
                                <Image src='/assets/chevrondown.svg' width={8} height={8} alt='ChevronDown' className='ml-2' fetchPriority='high' />
                            </div>
                        </div>
                    </div>
                    {router.pathname.startsWith('/profile') ? <>
                        <span onClick={() => router.push(`/`)} className='pt-1 font-light hover:text-white/80 text-xs w-full justify-end mx-0 md:hidden flex'>[Go Home]</span>
                    </> : <>
                        <span onClick={() => router.push(`/profile/${address}`)} className='pt-1 font-light hover:text-white/80 text-xs w-full justify-end mx-0 md:hidden flex'>[View Profile]</span>
                    </>}
                </div>
            </> : <>
                <span onClick={handleConnectModal} className='font-light hover:text-white/80'>[Connect Wallet]</span>
            </>}
            <>
                {isConnectModalOpen && <><ConnectModal showModal={isConnectModalOpen} closeModal={handleConnectModal} ref={ConnectModalRef} /></>}
            </>
            <>
                {isDisconnectModalOpen && <><DisconnectModal showModal={isDisconnectModalOpen} closeModal={handleDisconnectModal} ref={DisconnectModalRef} addr={address ? address : "not connected"} /></>}
            </>
        </>
    )
}

export default Connector
