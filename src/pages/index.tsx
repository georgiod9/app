import Head from 'next/head';
import { WebsiteName, WebsiteSlogan, WebsiteURL } from '@/constants';
import Navbar from '@/components/navbar';
import { useState, useRef, useEffect } from 'react';
import Spinner from '@/utils/spinner';
import Insight from '@/components/insight';
import { Switch } from '@headlessui/react'
import Image from 'next/image';
import ConnectModal from '@/components/modals/connect';
import { solana } from '@/constants';
import { useWallet, type Wallet } from '@solana/wallet-adapter-react';
import QModal from '@/components/modals/hover';
import Slider from 'rc-slider';
//import 'rc-slider/assets/index.css';

type ConnectModalRefType = HTMLDivElement | null
type CoinData = {
  coinData: {
    associated_bonding_curve: string;
    bonding_curve: string;
    complete: boolean;
    created_timestamp: number;
    creator: string;
    description: string;
    image_uri: string;
    inverted: null;
    king_of_the_hill_timestamp: null;
    last_reply: null;
    market_cap: number;
    market_id: null;
    metadata_uri: string;
    mint: string;
    name: string;
    nsfw: boolean;
    profile_image: string;
    raydium_pool: null;
    reply_count: number;
    show_name: boolean;
    symbol: string;
    telegram: string;
    total_supply: number;
    twitter: string;
    usd_market_cap: number;
    username: string;
    virtual_sol_reserves: number;
    virtual_token_reserves: number;
    website: string;
  },
};

export default function Home() {

  const [tokenContract, setTokenContract] = useState('')
  const [tokenError, setTokenError] = useState('')
  const [tokenSearching, setTokenSearching] = useState(false)
  const [tokenFound, setTokenFound] = useState(false)
  const [tokenData, setTokenData] = useState<CoinData | null>(null)
  const [botNbr, setBotNbr] = useState('10')
  const [frequency, setFrequency] = useState('30')
  const [expiry, setExpiry] = useState('24')
  const [funding, setFunding] = useState('')
  const [assignNames, setAssignNames] = useState(false)
  const [reply, setReply] = useState(false)

  const [isBotMenuOpen, setBotMenuOpen] = useState(false)
  const [isFrequencyMenuOpen, setFrequencyMenuOpen] = useState(false)
  const [isExpiryMenuOpen, setExpiryMenuOpen] = useState(false)

  const { connected, publicKey } = useWallet()

  const [QModalTokenOpen, setQModalOpen] = useState(false)

  const minDecimal = 0.001
  const maxDecimal = 2.000
  const initMin = 0.001
  const initMax = 1.000
  const scaleFactor = 1000
  const [range, setRange] = useState([initMin, initMax])

  const [serviceFee, setServiceFee] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

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
        console.log('Coin =>', data)
        setTokenSearching(false)
        setTokenData(data)
        setTokenFound(true)
        console.log(tokenData?.coinData.name)
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

  const handleBotNbr = (botNbr: string) => {
    setBotNbr(botNbr)
    setBotMenuOpen(false)
  }

  const handleBotNbrMenu = () => {
    if (!isBotMenuOpen) {
      setBotMenuOpen(true)
      setExpiryMenuOpen(false)
      setFrequencyMenuOpen(false)
    } else {
      setBotMenuOpen(false)
      setExpiryMenuOpen(false)
      setFrequencyMenuOpen(false)
    }
  }

  const handleExpiration = (expiry: string) => {
    setExpiry(expiry)
    setExpiryMenuOpen(false)
  }

  const handleExpirationMenu = () => {
    if (!isExpiryMenuOpen) {
      setBotMenuOpen(false)
      setExpiryMenuOpen(true)
      setFrequencyMenuOpen(false)
    } else {
      setBotMenuOpen(false)
      setExpiryMenuOpen(false)
      setFrequencyMenuOpen(false)
    }
  }

  const handleFrequency = (frequency: string) => {
    setFrequency(frequency)
    setFrequencyMenuOpen(false)
  }

  const handleFrequencyMenu = () => {
    if (!isFrequencyMenuOpen) {
      setBotMenuOpen(false)
      setExpiryMenuOpen(false)
      setFrequencyMenuOpen(true)
    } else {
      setBotMenuOpen(false)
      setExpiryMenuOpen(false)
      setFrequencyMenuOpen(false)
    }
  }

  function setFundingAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const fund = e.target.value
    const fundNbr = fund.replace(/[^0-9.]/g, '')
    if (fund !== fundNbr) {
      return null
    } else {
      setFunding(fundNbr)
    }
  }

  const convertToDecimal = (value: any) => {
    return (value / scaleFactor) * (maxDecimal - minDecimal) + minDecimal
  }

  const convertToSliderValue = (decimalValue: any) => {
    return ((decimalValue - minDecimal) / (maxDecimal - minDecimal)) * scaleFactor
  }

  const handleRangeSliderChange = (sliderValues: any) => {
    const decimalValues = sliderValues.map(convertToDecimal)
    setRange(decimalValues);
  }

  const sliderValues = range.map(convertToSliderValue)

  const calcFunding = (funding: string, bot: string) => {
    if (funding == '') { return 'Not set' }
    let fundNbr = parseInt(funding, 10)
    let botNbr = parseInt(bot, 10)
    console.log(fundNbr, botNbr)
    if (fundNbr < (0.1 * botNbr)) {
      return <>
        <span className='flex justify-center items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-red w-3 h-3">
            <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
          </svg>
          <span className='pl-1.5'>Too low</span>
        </span>
      </>
    } else {
      return <span>{fundNbr.toString()} SOL</span>
    }
  }

  const calcServicesFees = (bot: string, frequency: string, expiry: string) => {
    let botfee = 0
    if (bot == '5') {
      botfee += 0.5
    } else if (bot == '10') {
      botfee += 1
    } else if (bot == '20') {
      botfee += 2
    } else if (bot == '50') {
      botfee += 3.5
    } else {
      botfee + 0
    }
    let frequencyfee = 0
    if (frequency == '15') {
      frequencyfee += 0.5
    } else if (frequency == '5') {
      frequencyfee += 1
    } else (
      frequencyfee += 0
    )
    let expiryfee = 0
    if (expiry == '48') {
      expiryfee += 0.5
    } else if (expiry == '168') {
      expiryfee += 3
    } else {
      expiryfee += 0
    }
    let totalfee = (botfee + frequencyfee + expiryfee)
    setServiceFee(totalfee)
    return { totalfee }
  }

  useEffect(() => {
    calcServicesFees(botNbr, frequency, expiry)
  }, [botNbr, frequency, expiry])

  const calcTotal = (funding: string, serviceFee: number) => {
    let fundNbr = parseInt(funding, 10)
    if (funding == '') {
      setTotalPrice(0)
      return 0
    } else {
      let total = (fundNbr + serviceFee)
      setTotalPrice(total)
      return { total }
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

  function openQModal() {
    setQModalOpen(true)
  }

  function closeQModal() {
    setQModalOpen(false)
  }

  function bump(tokenContract: string, botNbr: string, frequency: string, expiry: string, assignNames: boolean, reply: boolean) {
    if (!connected && !publicKey) {
      handleConnectModal()
    } else {
      //TODO 
    }
  }

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
      <div className="md:flex md:flex-row md:row-span-2 items-center justify-center h-[100vh] mt-14 md:mt-0">
        <div className='flex justify-center mx-auto w-full md:w-1/2'>
          <div className='flex flex-col col-span-2 md:gap-y-14 gap-x-10 md:mx-32 mx-4'>
            <div className='md:order-1 order-2 md:pl-40 md:py-0 py-5'>
              <h1 className='text-lg md:text-4xl text-start'>Our Bots keep your token Bumping on Pump Dot Fun. A guaranteed Radyium listing!</h1>
            </div>
            <div className='md:order-2 order-1 md:pl-40 mt-2.5 md:mt-0'>
              <Insight />
            </div>
          </div>
        </div>
        <div className='flex justify-center mx-auto w-full md:w-1/2 pt-2 pb-5'>
          <div id='bump-form' className='bg-[#2E303A] rounded-md md:w-[60%] w-full mx-4'>
            <div className='mx-4 mt-3 mb-5'>
              <h2 className='mb-2 text-lg italic font-light flex justify-start mx-auto'>
                Bump Settings
              </h2>
              <div id='token-details' className='w-full rounded-md bg-[#FFFFFF1A] px-2 py-2'>
                <div className='flex font-[400]'>
                  <span className='text-[#FFFFFF80] text-xs md:text-sm'>Token address</span>
                  <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                  {QModalTokenOpen && <QModal text='test' />}
                  <svg
                    onMouseEnter={openQModal}
                    onMouseLeave={closeQModal}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div id='token-input' className='flex justify-start mt-1'>
                  <div className='relative w-full'>
                    <textarea
                      id="token"
                      name="token"
                      rows={1}
                      value={tokenContract}
                      onChange={(e) => searchContract(e)}
                      placeholder="Your pump.fun SPL token..."
                      className={`w-full text-sm rounded-md px-2.5 py-2 focus:outline-none ${tokenError ? 'focus:border-red' : 'focus:outline-none focus:border-green'} border border-white bg-bg/50`}
                      style={{ resize: "none" }}
                    />
                    {tokenSearching && <>
                      <div className="absolute bottom-[17px] right-2">
                        <Spinner className="w-4 h-4 spinner text-[#FFFFFF80] animate-spin fill-white" />
                      </div>
                    </>}
                  </div>
                </div>
                {tokenError && <p className='text-[8px] text-start text-red pl-1'>{tokenError}</p>}
                {tokenFound && <>
                  <div id='token-details' className='w-full rounded-md bg-[#FFFFFF1A] px-2 py-2'>
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
              <div id='bot-details' className='mt-2.5 pb-12 w-full rounded-md bg-[#FFFFFF1A] px-2 py-2'>
                <div className='flex flex-row row-span-2 gap-x-2.5'>
                  <div className='w-full'>
                    <div className='flex font-[400]'>
                      <span className='text-[#FFFFFF80] text-xs md:text-sm'>Number of Bots</span>
                      <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div id='bot-nbr-input' className='flex justify-start mt-1'>
                      <div className='relative w-full'>
                        <button
                          className="w-full text-sm rounded-md px-2 py-2  hover:outline-2 outline-8 border border-white bg-bg/50 flex justify-between items-center"
                          onClick={() => handleBotNbrMenu()}
                        >
                          <div>{botNbr == '1' ? `${botNbr} Bot` : `${botNbr} Bots`}</div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" className="w-3 h-3">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {isBotMenuOpen && (
                          <div className="absolute mt-0 w-full rounded-md shadow-lg bg-green/95 z-10">
                            <ul className='p-0.5 mx-0.5 text-[#000] font-[300] sm:text-sm text-xs'>
                              <li onClick={() => handleBotNbr('1')} className={`sm:px-2 px-1 py-2 my-0.5 cursor-pointer flex justify-between rounded-md ${botNbr == '1' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>1 Bot</span>
                                <span>(Free)</span>
                              </li>
                              <li onClick={() => handleBotNbr('5')} className={`sm:px-2 px-1 py-2 my-1 cursor-pointer flex justify-between rounded-md ${botNbr == '5' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>5 Bots</span>
                                <span>(0.5 SOL)</span>
                              </li>
                              <li onClick={() => handleBotNbr('10')} className={`sm:px-2 px-1 py-2 my-1 cursor-pointer flex justify-between rounded-md ${botNbr == '10' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>10 Bots</span>
                                <span>(1 SOL)</span>
                              </li>
                              <li onClick={() => handleBotNbr('20')} className={`sm:px-2 px-1 py-2 my-1 cursor-pointer flex justify-between rounded-md ${botNbr == '20' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>20 Bots</span>
                                <span>(2 SOL)</span>
                              </li>
                              <li onClick={() => handleBotNbr('50')} className={`sm:px-2 px-1 py-2 my-0.5 cursor-pointer flex justify-between rounded-md ${botNbr == '50' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>50 Bots</span>
                                <span>(3.5 SOL)</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex mt-2.5 font-[400]'>
                      <span className='text-[#FFFFFF80] text-xs md:text-sm'>Expiry</span>
                      <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div id='expiration-input' className='flex justify-start mt-1'>
                      <div className='relative w-full'>
                        <button
                          className="w-full text-sm rounded-md px-2 py-2  hover:outline-2 outline-8 border border-white bg-bg/50 flex justify-between items-center"
                          onClick={() => handleExpirationMenu()}
                        >
                          <div>{expiry != '168' ? `${expiry} Hours` : `1 Week`}</div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" className="w-3 h-3">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {isExpiryMenuOpen && (
                          <div className="absolute mt-0 w-full rounded-md shadow-lg bg-green/95 z-10">
                            <ul className='p-0.5 mx-0.5 text-[#000] font-[300] sm:text-sm text-xs'>
                              <li onClick={() => handleExpiration('24')} className={`sm:px-2 px-1 py-2 my-0.5 cursor-pointer flex justify-between rounded-md ${expiry == '24' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>24 Hours</span>
                                <span>(Free)</span>
                              </li>
                              <li onClick={() => handleExpiration('48')} className={`sm:px-2 px-1 py-2 my-1 cursor-pointer flex justify-between rounded-md ${expiry == '48' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>48 Hours</span>
                                <span>(0.5 SOL)</span>
                              </li>
                              <li onClick={() => handleExpiration('168')} className={`sm:px-2 px-1 py-2 my-0.5 cursor-pointer flex justify-between rounded-md ${expiry == '168' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>1 Week</span>
                                <span>(3 SOL)</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='flex font-[400]'>
                      <span className='text-[#FFFFFF80] text-xs md:text-sm'>Frequency</span>
                      <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div id='frequency-input' className='flex justify-start mt-1'>
                      <div className='relative w-full'>
                        <button
                          className="w-full text-sm rounded-md px-2 py-2  hover:outline-2 outline-8 border border-white bg-bg/50 flex justify-between items-center"
                          onClick={() => handleFrequencyMenu()}
                        >
                          <div>{frequency ? `${frequency} Sec` : 'Frequency'}</div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" className="w-3 h-3">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {isFrequencyMenuOpen && (
                          <div className="absolute mt-0 w-full rounded-md shadow-lg bg-green/95 z-10">
                            <ul className='p-0.5 mx-0.5 text-[#000] font-[300] sm:text-sm text-xs'>
                              <li onClick={() => handleFrequency('30')} className={`sm:px-2 px-1 py-2 my-0.5 cursor-pointer flex justify-between rounded-md ${frequency == '30' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>30 Sec</span>
                                <span>(Free)</span>
                              </li>
                              <li onClick={() => handleFrequency('15')} className={`sm:px-2 px-1 py-2 my-1 cursor-pointer flex justify-between rounded-md ${frequency == '15' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>15 Sec</span>
                                <span>(0.5 SOL)</span>
                              </li>
                              <li onClick={() => handleFrequency('5')} className={`sm:px-2 px-1 py-2 my-0.5 cursor-pointer flex justify-between rounded-md ${frequency == '5' ? 'bg-white' : 'hover:bg-white'}`}>
                                <span>5 Sec</span>
                                <span>(1 SOL)</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex mt-2.5 font-[400]'>
                      <span className='text-[#FFFFFF80] text-xs md:text-sm'>Fund Bots</span>
                      <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div id='funding-input' className='flex justify-start mt-1'>
                      <div className='relative w-full'>
                        <input
                          id="funding"
                          name="funding"
                          value={funding}
                          onChange={(e) => setFundingAmount(e)}
                          placeholder="0.01"
                          className="w-full text-sm rounded-md px-2.5 py-2 focus:outline-none focus:border-green border border-white bg-bg/50"
                        />
                        <div className="absolute bottom-[9px] right-2 text-sm">
                          SOL
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex mt-2.5 font-[400]'>
                  <span className='text-[#FFFFFF80] text-xs md:text-sm'>Buy Range</span>
                  <span className='text-[#FFFFFF80] text-[10px] ml-0.5'>*</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className='flex w-full mt-1'>
                  <span className='text-[#FFFFFF80] text-xs sm:text-sm flex justify-start mx-0 w-[10%]'>Min</span>
                  <div className='w-[80%] md:w-[85%] mt-0 md:mt-[3px] double-range-slider-container relative'>
                    <Slider
                      min={0.001}
                      max={scaleFactor}
                      value={sliderValues}
                      onChange={handleRangeSliderChange}
                      range
                    />
                    <div className="value-displays">
                      <span
                        className="value-display"
                        style={{ left: `${(sliderValues[0] / scaleFactor) * 100}%`, position: 'absolute', fontSize: '10px' }}
                      >
                        {range[0].toFixed(3)} SOL
                      </span>
                      <span
                        className="value-display"
                        style={{ left: `${(sliderValues[1] / scaleFactor) * 100}%`, position: 'absolute', fontSize: '10px' }}
                      >
                        {range[1].toFixed(2)} SOL
                      </span>
                    </div>
                  </div>
                  <span className='text-[#FFFFFF80] text-xs sm:text-sm flex justify-end mx-0 w-[10%] pl-8 md:pl-0'>Max</span>
                </div>
              </div>
              <div id='additionals-details' className='mt-2.5 w-full rounded-md bg-[#FFFFFF1A] px-2 py-2'>
                <div className='flex justify-between mx-auto'>
                  <div className='flex font-[400]'>
                    <span className='text-[#FFFFFF80] text-xs md:text-sm'>Assign names to wallets</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFFFFF80" className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[18px] md:h-[18px] opacity-50 hover:opacity-100 pt-0.5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
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
              </div>
              <div id='total' className='w-full px-2 py-2'>
                <div className='flex justify-between mx-auto my-1'>
                  <div className='flex'>
                    <span className='text-[#FFF] font-[400] text-sm'>Funding (redeemable)</span>
                  </div>
                  <div className='flex'>
                    <span className='text-red text-sm'>
                      {calcFunding(funding, botNbr)}
                    </span>
                  </div>
                </div>
                <div className='flex justify-between mx-auto my-1'>
                  <div className='flex'>
                    <span className='text-[#FFF] font-[400] text-sm'>Services</span>
                  </div>
                  <div className='flex'>
                    <span className='text-red text-sm'>{serviceFee == 0 ? 'Free' : <>{serviceFee} SOL</>}</span>
                  </div>
                </div>
                {totalPrice == 0 ? null : <>
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
              <div className='mx-1 mt-1 mb-2.5'>
                <button onClick={() => bump(tokenContract, botNbr, frequency, expiry, assignNames, reply)} className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80'>Start Bumping</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {isConnectModalOpen && <> <ConnectModal showModal={isConnectModalOpen} closeModal={handleConnectModal} ref={ConnectModalRef} /></>}
      </>
    </>
  );
}
