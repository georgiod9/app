import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { WebsiteName, WebsiteSlogan, WebsiteURL } from "@/constants";
import Navbar from "@/components/navbar";
import Spinner from "@/utils/spinner";
import QModal from "@/components/utils/hoverpr";
//import { BlockTimestamp } from '@solana/web3.js'
import {
  type OrderStateModalRefType,
  type BumpModalRefType,
} from "@/utils/types";
import BumpModal from "@/components/modals/bump";
import OrderStateModal from "@/components/modals/state";
import { IOrder } from "@/utils/interfaces";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { PROGRAM_ID, SOLANA } from "@/constants";
import { Buffer } from "buffer";

const Profile = () => {
  const router = useRouter();
  const { addr } = router.query as { addr: string };
  const { connected, publicKey, sendTransaction } = useWallet();

  const [bumpData, setBumpData] = useState<IOrder[]>([]);
  const [bumpDataLoaded, setBumpDataLoaded] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);

  const [QModalOpen, setQModalOpen] = useState(false);
  const [QModalOpen1, setQModalOpen1] = useState(false);

  const [solanaTimestamp, setSolanaTimestamp] = useState(0);

  useEffect(() => {
    if (addr && connected && publicKey) {
      const base58 = publicKey.toBase58();
      if (addr == base58) {
        loadBumpers(addr);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [addr, connected, publicKey]);

  async function getSolTimestamp() {
    const slot = await SOLANA.getSlot();
    const timestamp = await SOLANA.getBlockTime(slot);
    if (timestamp != null) {
      setSolanaTimestamp(timestamp);
    } else {
      setTimeout(() => {
        getSolTimestamp();
      }, 1500);
    }
  }

  useEffect(() => {
    if (solanaTimestamp == 0) getSolTimestamp();
  }, [solanaTimestamp]);

  const formatTimestamp = (timestamp: Date): string => {
    const date = new Date(timestamp);
    const ymd: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    };
    const hms: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return (
      date.toLocaleDateString(undefined, ymd) +
      "-" +
      date.toLocaleTimeString(undefined, hms)
    );
  };

  async function loadBumpers(addr: string) {
    let data = [] as IOrder[];
    let i = 0;
    setBumpDataLoaded(false);
    const encodedAddr = encodeURIComponent(addr);
    const orders = await fetch(`/api/uo/${encodedAddr}`);
    const ordersdata = await orders.json();
    if (!orders.ok) {
      setErrorLoading(true);
      throw new Error("Failed to fetch order data");
    }
    // data.push(ordersdata.orders)
    // console.log(ordersdata.orders)
    // console.log(data[0])
    // console.log("request ok for", addr)
    // console.log("Response status:", orders.status)
    // console.log("data", ordersdata.orders)
    // console.log(ordersdata.orders.length)
    //FOR EACH ordersdata.ORDERS, FETCH COIN AND SET : tokenName - tokenImage - tokenTicker
    for (i = 0; ordersdata.orders.length > i; i++) {
      const order = ordersdata.orders[i];
      const token = await fetch(`/api/getcoin/${order.token}`);
      const tokendata = await token.json();
      if (!token.ok) {
        setErrorLoading(true);
        throw new Error("Failed to fetch token data");
      }
      order.tokenName = tokendata.coinData.name;
      order.tokenImage = tokendata.coinData.image_uri;
      order.tokenTicker = tokendata.coinData.symbol;
      data.push(...ordersdata.orders);
      // console.log("data to fit", ordersdata.orders)
      // console.log("data before push", data)
      // data.push(tokenName)
    }
    setBumpData(data);
    setBumpDataLoaded(true);
  }

  const [tokenAddress, setTokenAddress] = useState("");
  const [orderStateId, setOrderStateId] = useState(0);
  const [orderStatus, setOrderStatus] = useState("");
  const OrderStateModalRef = useRef<OrderStateModalRefType>(null);
  const [isOrderStateModalOpen, setOrderStateModalOpen] = useState(false);

  const handleOrderStateModal = () => {
    setOrderStateModalOpen((prevState) => !prevState);
  };

  const setPropsAndHandleOrderStateModal = (
    id: number,
    token: string,
    status: string
  ) => {
    if (!isOrderStateModalOpen) {
      setOrderStateId(id);
      setOrderStatus(status);
      setTokenAddress(token);
      setOrderStateModalOpen((prevState) => !prevState);
    } else {
      setOrderStateModalOpen((prevState) => !prevState);
    }
  };

  const [bot, setBot] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenTicker, setTokenTicker] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  //const [bumpPackage, setBumpPackage] = useState(0)
  const [frequency, setFrequency] = useState(0);
  const [duration, setDuration] = useState(0);
  const [funding, setFunding] = useState(0);
  const [fee, setFee] = useState(0);

  const BumpModalRef = useRef<BumpModalRefType>(null);
  const [isBumpModalOpen, setBumpModalOpen] = useState(false);

  const handleBumpModal = () => {
    setBumpModalOpen((prevState) => !prevState);
  };

  const setPropsAndHandleBumpModal = (
    token: string,
    name: string,
    ticker: string,
    image: string,
    bot: number,
    frequency: number,
    duration: number,
    funding: number,
    fee: number
  ) => {
    if (!isBumpModalOpen) {
      setTokenAddress(token);
      setTokenName(name);
      setTokenTicker(ticker);
      setTokenImage(image);
      setBot(bot);
      setFrequency(frequency);
      setDuration(duration);
      setFunding(funding);
      setFee(fee);
      setBumpModalOpen((prevState) => !prevState);
    } else {
      setBumpModalOpen((prevState) => !prevState);
    }
  };

  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  function buildCancelInstructionData(orderId: number) {
    const instructionData = Buffer.alloc(5);
    instructionData.writeUInt32LE(orderId, 1);
    instructionData[0] = 2;
    return instructionData;
  }

  async function cancelOrder(orderId: number) {
    if (!publicKey) return;
    setTxLoading(true);
    setTxError(false);
    setTxSuccess(false);

    const instructionData = buildCancelInstructionData(orderId);
    const programId = new PublicKey(PROGRAM_ID);

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId,
        data: instructionData,
      })
    );

    try {
      const txSignature = await sendTransaction(transaction, SOLANA);
      setTxLoading(true);
      const ok = await SOLANA.confirmTransaction(txSignature, "confirmed");
      if (ok.value.err) {
        setTxLoading(false);
        setTxError(true);
      } else {
        setTxLoading(false);
        setTxSuccess(true);
      }
    } catch (e) {
      console.error(e);
      setTxLoading(false);
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
          <div className="flex justify-center mx-auto w-full">
            <div id="bump-form" className="bg-[#2E303A] rounded-md w-full">
              <div className="lg:mx-7 md:mx-4 mx-2.5">
                <h2 className="lg:my-5 md:my-4 my-2 text-lg italic font-light flex justify-start mx-auto">
                  Bumpers
                </h2>
                {!errorLoading && bumpDataLoaded ? (
                  <>
                    {bumpData.length > 0 ? (
                      <>
                        <div
                          id="user-bump"
                          style={{ maxHeight: "530px", overflowY: "auto" }}
                        >
                          {[...bumpData].reverse().map((data, index) => (
                            <div
                              key={index}
                              className="w-full rounded-md bg-[#FFFFFF1A] mt-3 md:mt-2 lg:mt-0 px-2 py-2 my-2.5 md:my-4"
                            >
                              <div className="h-fit w-full items-center block sm:px-1.5 py-1">
                                <div className="flex justify-between mx-auto w-full">
                                  <span className="text-[#FFF] text-xs md:text-sm font-[600]">
                                    {data.tokenName} [ticker: {data.tokenTicker}
                                    ]
                                  </span>
                                  <button
                                    onClick={() =>
                                      setPropsAndHandleOrderStateModal(
                                        data.id,
                                        data.token,
                                        data.status
                                      )
                                    }
                                    className="hidden sm:block text-[#FFF] text-xs md:text-sm font-extralight hover:opacity-80"
                                  >
                                    [Infos]
                                  </button>
                                </div>
                                <div className="mt-2.5 flex flex-row row-span-2 h-fit">
                                  <div className="w-1/3 md:w-[40%] h-[90px] md:h-[180px]">
                                    <img
                                      src={data.tokenImage}
                                      style={{
                                        width: "85%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      alt={`${data.tokenName} token`}
                                    />
                                  </div>
                                  <div className="w-2/3 md:w-[60%] text-[#FFFFFF80] font-[400] text-sm">
                                    <div className="flex flex-row row-span-2">
                                      <div id="name">
                                        <p>Order:</p>
                                        <p>Bots:</p>
                                        <p>Freq:</p>
                                        <p>Expiry:</p>
                                        <p>Fund:</p>
                                        <p>Status:</p>
                                        <p>Placed:</p>
                                      </div>
                                      <div id="data" className="mx-1 md:mx-2.5">
                                        <p className="text-white">
                                          {data.bot == 3 && <>Light Bump</>}
                                          {data.bot == 10 && (
                                            <>Keep it Bumping</>
                                          )}
                                          {data.bot == 25 && <>Max Bumping</>}
                                        </p>
                                        <p>{data.bot} Bots</p>
                                        <p>{data.frequency} sec</p>
                                        <p>{data.duration} hr</p>
                                        <p>{data.funding} SOL</p>
                                        <p>
                                          {data.status == "pending" && (
                                            <span className="text-yellow">
                                              Pending
                                            </span>
                                          )}
                                          {data.status == "live" && (
                                            <span className="text-green">
                                              Running
                                            </span>
                                          )}
                                          {data.status == "canceled" && (
                                            <span className="text-red">
                                              Canceled
                                            </span>
                                          )}
                                          {data.status == "finished" && (
                                            <span className="text-blue">
                                              Expired
                                            </span>
                                          )}
                                        </p>
                                        <p>{formatTimestamp(data.createdAt)}</p>
                                      </div>
                                    </div>
                                    {data.status == "live" && (
                                      <>
                                        <div className="flex relative mt-1.5 items-center gap-x-1">
                                          <button
                                            disabled={txSuccess}
                                            onClick={() => cancelOrder(data.id)}
                                            className={`sm:w-[90%] w-full ${
                                              txSuccess
                                                ? "bg-[#FFFFFF1A] text-[#FFFFFF80]"
                                                : "bg-white text-bg hover:opacity-80"
                                            } text-xs py-2 rounded-md`}
                                          >
                                            {txLoading ? (
                                              <>
                                                <div className="flex justify-center mx-auto my-0.5">
                                                  <Spinner className="w-3 h-3 spinner text-bg animate-spin fill-[#FFFFFF80]" />
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                {txSuccess ? (
                                                  <>
                                                    <div className="flex justify-center mx-auto text-xs text-green">
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="w-4 h-4"
                                                      >
                                                        <path
                                                          fillRule="evenodd"
                                                          d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                                                          clipRule="evenodd"
                                                        />
                                                      </svg>
                                                      <span className="ml-1">
                                                        Order canceled
                                                      </span>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <>Cancel & Withdraw</>
                                                )}
                                              </>
                                            )}
                                          </button>
                                          <span className="w-[10%] hidden sm:flex justify-center items-center">
                                            <div className="absolute">
                                              {QModalOpen && (
                                                <QModal
                                                  text="Bots will sell the tokens and withdraw the SOL to your wallet."
                                                  w={155}
                                                />
                                              )}
                                              <svg
                                                onMouseEnter={() =>
                                                  setQModalOpen(true)
                                                }
                                                onMouseLeave={() =>
                                                  setQModalOpen(false)
                                                }
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="#FFFFFF80"
                                                className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[20px] md:h-[20px] opacity-50 hover:opacity-100 pt-0.5"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            </div>
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {data.status == "pending" && (
                                      <>
                                        <div className="flex relative mt-1.5 items-center gap-x-1">
                                          <button
                                            disabled
                                            className="sm:w-[90%] w-full bg-[#FFFFFF1A] text-[#FFFFFF80] text-xs py-2 rounded-md"
                                          >
                                            Cancel & Withdraw
                                          </button>
                                          <span className="w-[10%] hidden sm:flex justify-center items-center">
                                            <div className="absolute">
                                              {QModalOpen1 && (
                                                <QModal
                                                  text="Order can only be canceled while running."
                                                  w={150}
                                                />
                                              )}
                                              <svg
                                                onMouseEnter={() =>
                                                  setQModalOpen1(true)
                                                }
                                                onMouseLeave={() =>
                                                  setQModalOpen1(false)
                                                }
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="#FFFFFF80"
                                                className="pl-0.5 md:pl-1 w-[15px] h-[15px] md:w-[20px] md:h-[20px] opacity-50 hover:opacity-100 pt-0.5"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            </div>
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {data.status == "canceled" && (
                                      <>
                                        <div className="flex relative mt-1.5 items-center gap-x-1">
                                          <button
                                            disabled
                                            className="sm:w-[95%] w-full bg-[#FFFFFF1A] text-[#FFFFFF80] text-xs py-2 rounded-md"
                                          >
                                            Canceled
                                          </button>
                                        </div>
                                      </>
                                    )}
                                    {data.status == "finished" && (
                                      <>
                                        <div className="flex relative mt-1.5 items-center gap-x-1">
                                          <button
                                            id="desktop-renew"
                                            onClick={() =>
                                              setPropsAndHandleBumpModal(
                                                data.token,
                                                data.tokenName,
                                                data.tokenTicker,
                                                data.tokenImage,
                                                data.bot,
                                                data.frequency,
                                                data.duration,
                                                data.funding,
                                                data.fee
                                              )
                                            }
                                            className="w-[95%] hidden sm:block bg-white text-bg text-xs py-2 rounded-md"
                                          >
                                            Renew
                                          </button>
                                          <button
                                            id="mobile-renew"
                                            onClick={() => router.push("/")}
                                            className="w-full sm:hidden bg-white text-bg text-xs py-2 rounded-md"
                                          >
                                            Renew
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          id="no-bump"
                          className="w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-3 md:mt-2 lg:mt-0 px-2 py-2 my-2.5 md:my-4 lg:my-7 flex items-center justify-center"
                        >
                          <div className="text-[#FFF] text-xs md:text-sm text-center w-full">
                            <span className="font-[600]">No Bumpers yet!</span>
                            <div className="mt-10 flex justify-center mx-auto">
                              <button
                                id="mobile-bump-btn"
                                onClick={() => router.push("/")}
                                className="text-bg bg-green w-[80%] rounded-md py-3 hover:opacity-80 md:hidden block"
                              >
                                + Add New Bump
                              </button>
                              <button
                                id="desktop-bump-btn"
                                onClick={() => router.push("/")}
                                className="text-bg bg-green w-[60%] rounded-md py-3 hover:opacity-80 hidden md:block"
                              >
                                + Add New Bump
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <>
                      {!errorLoading && !bumpDataLoaded && (
                        <>
                          <div
                            id="bump-data-loading"
                            className="w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-3 md:mt-2 lg:mt-0 px-2 py-2 my-2.5 md:my-4 lg:my-7 flex items-center justify-center"
                          >
                            <div className="flex text-center mx-auto justify-center w-full">
                              <Spinner className="w-8 h-8 spinner text-[#FFFFFF80] animate-spin fill-white" />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  </>
                )}
                {errorLoading && (
                  <>
                    <div
                      id="bump-data-error"
                      className="w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-3 md:mt-2 lg:mt-0 px-2 py-2 my-2.5 md:my-4 lg:my-7 flex items-center justify-center"
                    >
                      <div className="flex text-center text-xs mx-auto justify-center w-full">
                        <p className="text-red">
                          Unable to load bumpers. Please try again.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {!errorLoading && bumpDataLoaded && bumpData.length > 0 && (
            <>
              <div className="mt-4 mb-2.5">
                <div className="bg-[#2E303A] rounded-md w-full lg:px-7 md:p-4 p-2.5">
                  <button
                    id="mobile-bump-btn"
                    onClick={() => router.push("/")}
                    className="text-bg bg-green w-full rounded-md py-2 hover:opacity-80 md:hidden block"
                  >
                    + Add New Bump
                  </button>
                  <button
                    id="desktop-bump-btn"
                    onClick={() => router.push("/")}
                    className="text-bg bg-green w-full rounded-md py-2 hover:opacity-80 hidden md:block"
                  >
                    + Add New Bump
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <>
        {isOrderStateModalOpen && (
          <>
            <OrderStateModal
              showModal={isOrderStateModalOpen}
              closeModal={handleOrderStateModal}
              ref={OrderStateModalRef}
              id={orderStateId}
              token={tokenAddress}
              status={orderStatus}
            />
          </>
        )}
      </>
      <>
        {isBumpModalOpen && (
          <>
            <BumpModal
              showModal={isBumpModalOpen}
              closeModal={handleBumpModal}
              ref={BumpModalRef}
              tokenAddress={tokenAddress}
              tokenName={tokenName}
              tokenTicker={tokenTicker}
              tokenImage={tokenImage}
              bot={bot}
              frequency={frequency}
              duration={duration}
              funding={funding}
              fee={fee}
            />
          </>
        )}
      </>
    </>
  );
};

export default Profile;
