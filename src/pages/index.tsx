import Head from 'next/head';
import { WebsiteName, WebsiteSlogan, WebsiteURL } from '@/constants';
import Navbar from '@/components/navbar';
import { useState, useRef, useEffect } from 'react';
import Spinner from '@/utils/spinner';
import Insight from '@/components/insight';
import Image from 'next/image';
import ConnectModal from '@/components/modals/connect';
import { type CoinData, type ConnectModalRefType, type BumpModalRefType } from '@/utils/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, TransactionInstruction, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { PROGRAM_ID, ACCOUNT_BOT_PK, ACCOUNT_PROTOCOL_PK, SOLANA } from '@/constants';
import { Buffer } from 'buffer';
import bs58 from 'bs58';
import QModal from '@/components/utils/hover';
//import Slider from 'rc-slider';
//import { Switch } from '@headlessui/react'
// import BumpModal from '@/components/modals/bump';

export default function Home() {

  const { connected, publicKey, sendTransaction } = useWallet()

  const [bumpPackage, setBumpPackage] = useState(0)
  const [bot, setBot] = useState(0)
  const [funding, setFunding] = useState('')
  const [frequency, setFrequency] = useState(0)
  const [duration, setDuration] = useState('1')

  const [tokenContract, setTokenContract] = useState('')
  const [tokenError, setTokenError] = useState('')
  const [tokenSearching, setTokenSearching] = useState(false)
  const [tokenFound, setTokenFound] = useState(false)
  const [tokenData, setTokenData] = useState<CoinData | null>(null)

  const [QModalTokenOpen0, setQModalOpen0] = useState(false)
  const [QModalTokenOpen1, setQModalOpen1] = useState(false)
  const [QModalTokenOpen2, setQModalOpen2] = useState(false)
  const [QModalTokenOpen3, setQModalOpen3] = useState(false)
  const [QModalTokenOpen4, setQModalOpen4] = useState(false)

  const [serviceFee, setServiceFee] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const [fundingNotSet, setFundingNotSet] = useState(false)
  const [fundingTooLow, setFundingTooLow] = useState(false)

  const [bumpOk, setBumpOk] = useState(false)

  // const [assignNames, setAssignNames] = useState(false)
  // const [reply, setReply] = useState(false

  useEffect(() => {
    if (bumpPackage == 1) {
      setBot(3)
    } else if (bumpPackage == 2) {
      setBot(10)
    } else {
      setBot(25)
    }
  }, [bumpPackage])

  async function searchContract(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const token = e.target.value
    setTokenContract(token)
    if (token.length > 0 && token.length < 40 || token.length > 45) {
      setTokenError('Invalid token address.')
      setTokenSearching(false)
      setTokenFound(false)
    } else if (token.length == 0) {
      setTokenSearching(false)
      setTokenError('')
      setTokenFound(false)
    } else {
      setTokenSearching(true)
      setTokenError('')
      try {
        const res = await fetch(`/api/getcoin/${token}`)
        if (!res.ok) {
          throw new Error(`Error from pump.fun => ${res.status}`)
        }
        const data = await res.json()
        setTokenSearching(false)
        setTokenData(data)
        setTokenFound(true)
      } catch (e) {
        console.error(e)
        setTokenError('Invalid token address.')
        setTokenSearching(false)
        setTokenFound(false)
      }
    }
  }

  function deleteToken() {
    setTokenFound(false)
    setTokenError('')
    setTokenSearching(false)
    setTokenContract('')
  }

  function formatAddress(address: string) {
    const pr = address.substring(0, 5)
    const sf = address.substring(address.length - 3)
    return `${pr}...${sf}`
  }

  const formatMC = (mc: number): JSX.Element => {
    let marketcap = mc.toString()
    return <span>{marketcap}</span>
  }

  function selectFunding(e: React.ChangeEvent<HTMLInputElement>) {
    const fund = e.target.value
    const fundNbr = fund.replace(/[^0-9.]/g, '')
    const dot = fundNbr.split('.').length - 1
    if (fund !== fundNbr) {
      return null
    } else if (dot > 1) {
      return null
    } else {
      setFunding(fundNbr)
    }
  }

  function selectDuration(e: React.ChangeEvent<HTMLInputElement>) {
    const day = e.target.value
    const dayNbr = day.replace(/[^0-9]/g, '')
    if (dayNbr.startsWith('0') && dayNbr.length === 1) {
      return null
    } else {
      setDuration(dayNbr)
    }
  }

  const calcFunding = (funding: string, duration: string) => {
    if (funding == '' || funding == '0') {
      if (!fundingNotSet) {
        setFundingNotSet(true)
      }
      return 'Not set'
    } else {
      if (fundingNotSet) {
        setFundingNotSet(false)
      }
    }
    let fundNbr = parseFloat(funding)
    let botNbr = 0
    if (bumpPackage == 1) {
      botNbr = 3
    } else if (bumpPackage == 2) {
      botNbr = 10
    } else if (bumpPackage == 3) {
      botNbr = 25
    } else {
      botNbr = 0
    }
    let dayNbr = parseFloat(duration)
    if (fundNbr < (0.1 * botNbr * dayNbr)) {
      if (!fundingTooLow) {
        setFundingTooLow(true)
      }
      return <>
        <span className='flex justify-center items-center'>
          <div className='relative'>
            {QModalTokenOpen3 && <QModal text='Minimum funding is 0.1 SOL/Wallet/Day.' w={155} />}
            <svg
              onMouseEnter={() => setQModalOpen3(true)}
              onMouseLeave={() => setQModalOpen3(false)}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
          </div>
          <span className='pl-1.5'>Too low</span>
        </span>
      </>
    } else {
      if (fundingNotSet) {
        setFundingNotSet(false)
      }
      if (fundingTooLow) {
        setFundingTooLow(false)
      }
      return <span>{fundNbr} SOL</span>
    }
  }

  function formatFee(totalFee: number) {
    const fee = totalFee.toFixed(2)
    return parseFloat(fee)
  }

  const calcServicesFees = (bump: number, funding: string, duration: string) => {
    let service = 0
    let fundNbr = parseFloat(funding)
    let fundFee = (fundNbr * 0.02)
    let dayNbr = parseFloat(duration)
    if (bump == 1) {
      service = 0.05
    } else if (bump == 2) {
      service = 0.1
    } else if (bump == 3) {
      service = 0.2
    } else {
      service == 0
    }
    let totalfee = (service + (fundFee * dayNbr))
    let feeReturn = formatFee(totalfee)
    setServiceFee(feeReturn)
    return <span>{feeReturn} SOL</span>
  }

  useEffect(() => {
    calcServicesFees(bumpPackage, funding, duration)
  }, [bumpPackage, funding, duration])

  const calcTotal = (funding: string, serviceFee: number) => {
    let fundNbr = parseFloat(funding)
    if (funding == '') {
      setTotalPrice(0)
      return 0
    } else {
      let total = (fundNbr + serviceFee)
      let totalReturn = formatFee(total)
      setTotalPrice(totalReturn)
      return { totalReturn }
    }
  }

  useEffect(() => {
    calcTotal(funding, serviceFee)
  }, [funding, serviceFee])

  const ConnectModalRef = useRef<ConnectModalRefType>(null)
  const [isConnectModalOpen, setConnectModalOpen] = useState(false)

  const handleConnectModal = () => {
    setConnectModalOpen(prevState => !prevState)
  }

  useEffect(() => {
    if (bumpPackage != 0 && tokenFound && funding && duration) {
      setBumpOk(true)
    } else {
      setBumpOk(false)
    }
  }, [bumpPackage, tokenFound, funding, duration])

  useEffect(() => {
    if (bumpPackage == 1) {
      setFrequency(60)
    } else if (bumpPackage == 2) {
      setFrequency(30)
    } else if (bumpPackage == 3) {
      setFrequency(10)
    }
  }, [bumpPackage])


  const [bal, setBal] = useState<any>(0)

  useEffect(() => {
    const getSolBal = async (publicKey: any) => {
      const bal = await SOLANA.getBalanceAndContext(publicKey)
      const balance = bal.value / (10 ** 9)
      setBal(balance)
    }
    if (connected && publicKey) {
      getSolBal(publicKey)
    }
  }, [connected, publicKey])

  function bump(bumpPackage: number, tokenFound: boolean, duration: string) {
    if (!connected && !publicKey) {
      handleConnectModal()
    } else {
      if (bumpPackage == 0) {
        alert('Bump package not selected.')
      } else if (tokenFound == false) {
        alert('Invalid token address.')
      } else if (duration == '' || duration == '0') {
        alert('Invalid duration.')
      } else if (fundingNotSet) {
        alert('Funding not set.')
      } else if (fundingTooLow) {
        alert('Funding too low.')
      } else if (totalPrice > bal) {
        alert('Balance too low.')
      } else {
        createOrder(tokenContract, bot, frequency, parseFloat(duration) * 24, parseFloat(funding), serviceFee)
      }
    }
  }

  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState(false)
  const [txSuccess, setTxSuccess] = useState(false)

  const createOrder = async (token: string, bot: number, freq: number, dur: number, funding: number, fee: number) => {
    if (!publicKey) return
    setTxLoading(true)
    setTxError(false)
    setTxSuccess(false)

    const tokenAddr = token;
    const tokenBytes = bs58.decode(tokenAddr);
    const botNbr = bot;
    const frequency = freq;
    const duration = dur;
    const fundingLp = funding * 100;
    const feeLp = fee * 100;

    const orderData = Buffer.alloc(46);
    orderData.set(tokenBytes, 0);
    orderData.writeUInt8(botNbr, 32);
    orderData.writeUInt8(frequency, 33);
    orderData.writeUInt32LE(duration, 34);
    orderData.writeUInt32LE(fundingLp, 38);
    orderData.writeUInt32LE(feeLp, 42);

    const instructionData = Buffer.from([1, ...orderData]);

    const programId = new PublicKey(PROGRAM_ID);
    const accountBotPk = new PublicKey(ACCOUNT_BOT_PK);
    const accountProtocolPk = new PublicKey(ACCOUNT_PROTOCOL_PK);

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: accountProtocolPk, isSigner: false, isWritable: true },
          { pubkey: accountBotPk, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId,
        data: instructionData,
      })
    );

    try {
      const txSignature = await sendTransaction(transaction, SOLANA)
      setTxLoading(true)
      const ok = await SOLANA.confirmTransaction(txSignature, 'confirmed')
      if (ok.value.err) {
        setTxLoading(false)
        setTxError(true)
      } else {
        setTxLoading(false)
        setTxSuccess(true)
      }
    } catch (e) {
      console.error(e)
      setTxLoading(false)
    }
  };

  return (
    <>
      <Head>
        <title>{WebsiteName + " | " + WebsiteSlogan}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={WebsiteSlogan} />
        <meta name="robots" content="follow, index" />
        <link rel="canonical" href={WebsiteURL} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={WebsiteName + " | " + WebsiteSlogan} />
        <meta property="og:description" content={WebsiteSlogan} />
        <meta property="og:url" content={WebsiteURL} />
        <meta property="og:image" content={`${WebsiteURL}/og.jpg`} />
      </Head>
      <Navbar />
      <div className="block justify-center md:mt-0 md:max-w-xl lg:max-w-6xl md:mx-auto mx-2.5">
        <div id='hero' className='mt-20 md:mt-28'>
          <h1 className='text-lg md:text-2xl lg:text-4xl md:text-center text-start font-[400]'>Our Bots keep your token Bumping on Pump Dot Fun. A guaranteed Radyium listing!</h1>
        </div>
        <div id='insights' className='md:flex md:justify-center md:mx-auto my-5 md:my-8'>
          <Insight />
        </div>
      </div>
      <div className="block justify-center mt-2.5 md:mt-0 md:max-w-xl lg:max-w-6xl md:mx-auto mx-2.5">
        <div className='flex justify-center mx-auto w-full'>
          <div id='bump-form' className='bg-[#2E303A] rounded-md w-full mb-10'>
            <div className='lg:mx-7 md:mx-4 mx-2.5'>
              <h2 className='lg:my-6 md:my-4 text-lg italic font-light hidden sm:flex justify-start mx-auto'>
                Create a Bump
              </h2>
              <h2 className='my-2 text-lg italic font-light flex sm:hidden justify-start mx-auto'>
                Bump Settings
              </h2>
              <div id='bump-settings' className='lg:flex lg:flex-row lg:row-span-2 lg:gap-x-8'>
                <div id='package-selector' className='lg:w-1/2 w-full'>
                  <div id='package-1' onClick={() => setBumpPackage(1)} className={`w-full select-none rounded-md px-3 py-2.5 ${bumpPackage == 1 ? 'bg-green text-[#000]' : 'bg-[#FFFFFF1A] hover:bg-[#FFFFFF1A]/15 text-white'}`}>
                    <div className='flex flex-row row-span-3'>
                      <div className='w-[15%] sm:w-[7.5%]'>
                        {bumpPackage == 1 ? <>
                          <div className='mt-1 w-6 h-6 border rounded-full bg-white border-white text-green flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex justify-center items-center m-auto">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </> : <>
                          <div className='mt-1 w-6 h-6 border rounded-full' />
                        </>}
                      </div>
                      <div className='w-[85%] sm:w-[67.5%]'>
                        <h3 className='font-[600] text-lg'>Light Bump</h3>
                        <span className='sm:hidden py-0.5 font-[500] text-md'>0.05 Sol<span className='opacity-50 text-sm font-[400] pl-1'>/day</span></span>
                        <p className='font-[400] text-sm opacity-50 py-1.5 sm:py-0 sm:pt-2 sm:pb-1.5'>3 Wallet Bumping the Token</p>
                        <p className='font-[400] text-sm opacity-50'>1 Bump per Minute</p>
                      </div>
                      <div className='hidden sm:block sm:w-[25%]'>
                        <span className='flex items-center justify-end py-0.5 font-[500] text-md'>0.05 Sol<span className='opacity-50 text-sm font-[400] pl-1'>/day</span></span>
                      </div>
                    </div>
                  </div>
                  <div id='package-2' onClick={() => setBumpPackage(2)} className={`my-3 w-full select-none rounded-md px-3 py-2.5 ${bumpPackage == 2 ? 'bg-green text-[#000]' : 'bg-[#FFFFFF1A] hover:bg-[#FFFFFF1A]/15 text-white'}`}>
                    <div className='flex flex-row row-span-3'>
                      <div className='w-[15%] sm:w-[7.5%]'>
                        {bumpPackage == 2 ? <>
                          <div className='mt-1 w-6 h-6 border rounded-full bg-white border-white text-green flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex justify-center items-center m-auto">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </> : <>
                          <div className='mt-1 w-6 h-6 border rounded-full' />
                        </>}
                      </div>
                      <div className='w-[85%] sm:w-[67.5%]'>
                        <h3 className='font-[600] text-lg'>Keep it Bumping</h3>
                        <span className='sm:hidden py-0.5 font-[500] text-md'>0.1 Sol<span className='opacity-50 text-sm font-[400] pl-1'>/day</span></span>
                        <p className='font-[400] text-sm opacity-50 py-1.5 sm:py-0 sm:pt-2 sm:pb-1.5'>10 Wallet Bumping the Token</p>
                        <p className='font-[400] text-sm opacity-50'>1 Bump per 30 Seconds</p>
                      </div>
                      <div className='hidden sm:block sm:w-[25%]'>
                        <span className='flex items-center justify-end py-0.5 font-[500] text-md'>0.1 Sol<span className='opacity-50 text-sm font-[400] pl-1'>/day</span></span>
                      </div>
                    </div>
                  </div>
                  <div id='package-3' onClick={() => setBumpPackage(3)} className={`w-full rounded-md select-none px-3 py-2.5 ${bumpPackage == 3 ? 'bg-green text-[#000]' : 'bg-[#FFFFFF1A] hover:bg-[#FFFFFF1A]/15 text-white'}`}>
                    <div className='flex flex-row row-span-3'>
                      <div className='w-[15%] sm:w-[7.5%]'>
                        {bumpPackage == 3 ? <>
                          <div className='mt-1 w-6 h-6 border rounded-full bg-white border-white text-green flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex justify-center items-center m-auto">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </> : <>
                          <div className='mt-1 w-6 h-6 border rounded-full' />
                        </>}
                      </div>
                      <div className='w-[85%] sm:w-[67.5%]'>
                        <h3 className='font-[600] text-lg'>Max Bumping to Radyium</h3>
                        <span className='sm:hidden py-0.5 font-[500] text-md'>0.2 Sol<span className='opacity-50 text-sm font-[400] pl-1'>/day</span></span>
                        <p className='font-[400] text-sm opacity-50 py-1.5 sm:py-0 sm:pt-2 sm:pb-1.5'>25 Wallet Bumping the Token</p>
                        <p className='font-[400] text-sm opacity-50'>1 Bump per 10 Seconds</p>
                      </div>
                      <div className='hidden sm:block sm:w-[25%]'>
                        <span className='flex items-center justify-end py-0.5 font-[500] text-md'>0.2 Sol<span className='opacity-50 text-sm font-[400] pl-1'>/day</span></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div id='bump-details' className='lg:w-1/2 w-full'>
                  <div id='token-details'>
                    {!tokenFound ? <>
                      <div className='mt-3 lg:mt-0 w-full rounded-md px-3 py-2.5 bg-[#FFFFFF1A] text-white'>
                        <div id='label' className='sm:flex sm:flex-row sm:row-span-2 sm:items-center'>
                          <div className='flex font-[400] sm:w-[35%]'>
                            <span className='text-[#FFFFFF80] text-xs md:text-sm'>Token address</span>
                            <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                            <div className='relative'>
                              {QModalTokenOpen0 && <QModal text='The token address you want to pump.' w={140} />}
                              <svg
                                onMouseEnter={() => setQModalOpen0(true)}
                                onMouseLeave={() => setQModalOpen0(false)}
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div id='token-input' className='flex justify-start sm:w-[65%] sm:mt-0 mt-1.5'>
                            <div className='relative w-full'>
                              <textarea
                                id="token"
                                name="token"
                                rows={1}
                                value={tokenContract}
                                onChange={(e) => searchContract(e)}
                                placeholder="Address"
                                className={`w-full h-full flex text-sm rounded-md px-3 py-2 sm:py-2.5 focus:outline-none ${tokenError ? 'focus:border-red' : 'focus:outline-none focus:border-green'} border border-white bg-bg/50`}
                                style={{ resize: "none" }}
                              />
                              {tokenSearching && <>
                                <div className="absolute bottom-[17px] right-2">
                                  <Spinner className="w-4 h-4 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                </div>
                              </>}
                            </div>
                          </div>
                        </div>
                        {tokenError && <p className='text-[8px] text-start sm:text-end text-red pt-2 p-1'>{tokenError}</p>}
                      </div>
                    </> : <>
                      <div className='mt-3 lg:mt-0 w-full rounded-md bg-[#FFFFFF1A] px-2 py-2'>
                        <div className='flex font-[600] justify-between'>
                          <div id='token-infos-full' className='flex'>
                            {tokenData?.coinData.image_uri && <Image src={tokenData?.coinData.image_uri} width={53.5} height={53.5} alt={`${tokenData?.coinData.name} Token Logo`} className='rounded-sm' unoptimized fetchPriority='auto' />}
                            <span className='flex-col leading-none'>
                              <span className='flex'>
                                <span className='text-[#FFF] text-sm pl-2'>{tokenData?.coinData.name}</span>
                                <span className='text-[#FFFFFF80] text-sm pl-1.5'>[ticker: {tokenData?.coinData.symbol}]</span>
                              </span>
                              <span className='text-blue text-xs pl-2 font-[400]'>Created by {tokenData && <>{tokenData.coinData.username ? <>{(tokenData.coinData.username)}</> : <>{formatAddress(tokenData.coinData.creator)}</>}</>}</span>
                              <br />
                              <span className='text-green text-xs pl-2 font-[400]'>Market Cap: {tokenData && <>{formatMC(tokenData.coinData.market_cap)}</>}</span>
                            </span>
                          </div>
                          <div className='flex'>
                            <button onClick={() => deleteToken()} id='cancel-btn' className='text-red text-sm flex justify-end mx-1 hover:opacity-80'>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] mt-[1px]">
                                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>}
                  </div>
                  <div id='bump-details'>
                    <div className='my-3 w-full rounded-md px-3 py-2.5 bg-[#FFFFFF1A] text-white'>
                      <div id='funding' className='sm:flex sm:flex-row sm:row-span-2 sm:items-center'>
                        <div id='label' className='flex font-[400] sm:w-[35%]'>
                          <span className='text-[#FFFFFF80] text-xs md:text-sm'>Fund Bots</span>
                          <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                          <div className='relative'>
                            {QModalTokenOpen1 && <QModal text='Fund your bots with SOL to trade your token. You can withdraw the funds at any time.' w={195} />}
                            <svg
                              onMouseEnter={() => setQModalOpen1(true)}
                              onMouseLeave={() => setQModalOpen1(false)}
                              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div id='funding-input' className='flex justify-start sm:w-[65%] sm:mt-0 mt-1.5'>
                          <div className='relative w-full'>
                            <input
                              id="funding"
                              name="funding"
                              value={funding}
                              onChange={(e) => selectFunding(e)}
                              placeholder="0.01"
                              className="w-full h-full text-sm rounded-md px-3 py-2 sm:py-2.5 focus:outline-none focus:border-green border border-white bg-bg/50"
                            />
                            <div className="absolute bottom-[9px] sm:bottom-[10.5px] right-3 opacity-90 text-sm">
                              SOL
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id='duration' className='mt-3 sm:mt-5 sm:flex sm:flex-row sm:row-span-2 sm:items-center'>
                        <div id='label' className='flex font-[400] sm:w-[35%]'>
                          <span className='text-[#FFFFFF80] text-xs md:text-sm'>Bump for</span>
                          <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                          <div className='relative'>
                            {QModalTokenOpen2 && <QModal text='Select the duration that you want bots run trades on your token.' w={180} />}
                            <svg
                              onMouseEnter={() => setQModalOpen2(true)}
                              onMouseLeave={() => setQModalOpen2(false)}
                              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div id='duration-input' className='flex justify-start sm:w-[65%] sm:mt-0 mt-1.5'>
                          <div className='relative w-full'>
                            <input
                              id="duration"
                              name="duration"
                              value={duration}
                              onChange={(e) => selectDuration(e)}
                              placeholder="1"
                              className="w-full h-full text-sm rounded-md px-3 py-2 sm:py-2.5 focus:outline-none focus:border-green border border-white bg-bg/50"
                            />
                            <div className="absolute bottom-[9px] sm:bottom-[10.5px] right-3 opacity-90 text-sm">
                              Day
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id='pricing' className='w-full px-2 py-1'>
                    <div id='funding' className='flex justify-between mx-auto'>
                      <div className='flex'>
                        <span className='text-[#FFF] font-[400] text-sm'>Funding (redeemable)</span>
                      </div>
                      <div className='flex'>
                        <span className='text-red text-sm'>
                          {calcFunding(funding, duration)}
                        </span>
                      </div>
                    </div>
                    <div id='service' className='flex justify-between mx-auto my-1'>
                      <div className='flex'>
                        <span className='text-[#FFF] font-[400] text-sm'>Services</span>
                        <div className='relative'>
                          {QModalTokenOpen4 && <QModal text='The price of your choosen package per day + 2% of your bots funding.' w={160} />}
                          <svg
                            onMouseEnter={() => setQModalOpen4(true)}
                            onMouseLeave={() => setQModalOpen4(false)}
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-1 md:mt-0 mt-[1.5px]">
                            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className='flex'>
                        <span className='text-red text-sm'>{Number.isNaN(serviceFee) ? 'Not Set' : <>{serviceFee} SOL</>}</span>
                      </div>
                    </div>
                    <div id='total'>
                      {Number.isNaN(totalPrice) ? null : <>
                        <div className='py-2'>
                          <div className='border-t-[1px] border-[#FFFFFF1A]' />
                        </div>
                        <div className='flex justify-between mx-auto my-1'>
                          <div className='flex'>
                            <span className='text-[#FFF] font-[600] text-sm'>Total:</span>
                          </div>
                          <div className='flex'>
                            <span className='text-red text-sm'>{totalPrice} SOL</span>
                          </div>
                        </div>
                      </>}
                    </div>
                  </div>
                </div>
              </div>
              <div id='bump-btn' className='lg:my-5 md:my-3 my-2 w-full lg:flex lg:flex-row lg:row-span-2 lg:gap-x-8'>
                <div className='w-full hidden lg:block' />
                <div className='w-full'>
                  <button disabled={!bumpOk || txSuccess} onClick={() => bump(bumpPackage, tokenFound, duration)} className={`font-[400] text-sm w-full rounded-md px-10 py-2 lg:py-3 ${bumpOk && !txSuccess ? 'text-bg bg-green hover:opacity-80' : 'bg-[#FFFFFF1A] text-[#FFFFFF80]'}`}>
                    {txLoading ? <>
                      <div className='flex justify-center mx-auto'>
                        <Spinner className="w-5 h-5 spinner text-[#FFFFFF80] animate-spin fill-white" />
                      </div>
                    </> : <>
                      {txSuccess ? <>
                        <div className='my-0.5 flex justify-center mx-auto text-xs text-green'>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
                          <span className='ml-1'>Order placed successfully!</span>
                        </div>
                      </> : <>Start Bumping</>}
                    </>}
                  </button>
                </div>
              </div>
              {/* <div id='additionals-details' className='mt-2.5 w-full rounded-md bg-[#FFFFFF1A] px-2 py-2'>
                <div className='flex justify-between mx-auto'>
                  <div className='flex font-[400]'>
                    <span className='text-[#FFFFFF80] text-xs md:text-sm'>Assign names to wallets</span>
                    <div className='relative'>
                      {QModalTokenOpen6 && <QModal text='The system generate names to the bots to look more legit.' w={220} />}
                      <svg
                        onMouseEnter={() => setQModalOpen6(true)}
                        onMouseLeave={() => setQModalOpen6(false)}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className='flex font-[400]'>
                    <span className='text-[#FFF] text-xs md:text-sm'>1 SOL</span>
                    <Switch
                      checked={assignNames}
                      onChange={setAssignNames}
                      className={`${assignNames ? 'bg-green' : 'bg-[#666666]'
                        } relative inline-flex h-4 sm:h-5 w-8 sm:w-10 items-center rounded-xl ml-1 md:ml-1.5`}
                    >
                      <span className="sr-only">Assign names to wallets</span>
                      <span
                        className={`${assignNames ? 'translate-x-[16px] sm:translate-x-[20px]' : 'translate-x-[1px] sm:translate-x-[2px]'
                          } inline-block h-[15px] w-[15px] sm:h-[18px] sm:w-[18px] transform rounded-full bg-bg transition`}
                      />
                    </Switch>
                  </div>
                </div>
                <div className='flex justify-between mx-auto mt-2.5'>
                  <div className='flex font-[400]'>
                    <span className='text-[#FFFFFF80] text-xs md:text-sm'>Reply to token profile</span>
                    <div className='relative'>
                      {QModalTokenOpen7 && <QModal text='Bots reply automatically to the pump dot fun token profile. Make it more legit.' w={220} />}
                      <svg
                        onMouseEnter={() => setQModalOpen7(true)}
                        onMouseLeave={() => setQModalOpen7(false)}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className='flex font-[400]'>
                    <span className='text-[#FFF] text-xs md:text-sm'>1 SOL</span>
                    <Switch
                      checked={reply}
                      onChange={setReply}
                      className={`${reply ? 'bg-green' : 'bg-[#666666]'
                        } relative inline-flex h-4 sm:h-5 w-8 sm:w-10 items-center rounded-xl ml-1 md:ml-1.5`}
                    >
                      <span className="sr-only">Reply to token profile</span>
                      <span
                        className={`${reply ? 'translate-x-[16px] sm:translate-x-[20px]' : 'translate-x-[1px] sm:translate-x-[2px]'
                          } inline-block h-[15px] w-[15px] sm:h-[18px] sm:w-[18px] transform rounded-full bg-bg transition`}
                      />
                    </Switch>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div >
      <>
        {isConnectModalOpen && <><ConnectModal showModal={isConnectModalOpen} closeModal={handleConnectModal} ref={ConnectModalRef} /></>}
      </>
    </>
  );
}
