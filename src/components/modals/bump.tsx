import React, { forwardRef, useEffect, useState } from "react";
import Spinner from "@/utils/spinner";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  PROGRAM_ID,
  ACCOUNT_BOT_PK,
  ACCOUNT_PROTOCOL_PK,
  SOLANA,
} from "@/constants";
import { Buffer } from "buffer";
import bs58 from "bs58";

interface BumpModalProps {
  showModal: boolean;
  closeModal: () => void;
  tokenAddress: string;
  tokenTicker: string;
  tokenName: string;
  tokenImage: string;
  bot: number;
  frequency: number;
  duration: number;
  funding: number;
  fee: number;
}

const BumpModal = forwardRef<HTMLDivElement, BumpModalProps>(
  (
    {
      showModal,
      closeModal,
      tokenAddress,
      tokenName,
      tokenTicker,
      tokenImage,
      bot,
      frequency,
      duration,
      funding,
      fee,
    },
    ref
  ) => {
    useEffect(() => {
      const handleScroll = (event: Event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
      };
      if (showModal) {
        document.body.style.overflow = "hidden";
        window.addEventListener("scroll", handleScroll, { passive: false });
        window.scrollTo(0, 0);
      } else {
        document.body.style.overflow = "";
        window.removeEventListener("scroll", handleScroll);
      }
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [showModal]);

    const handleModal = () => {
      if (showModal) {
        closeModal();
        document.body.style.overflow = "";
      } else {
        closeModal();
        window.scrollTo(0, 0);
      }
    };

    function formatAddress(address: string) {
      const pr = address.substring(0, 5);
      const sf = address.substring(address.length - 5);
      return `${pr}...${sf}`;
    }

    const { publicKey, sendTransaction } = useWallet();
    const [txLoading, setTxLoading] = useState(false);
    const [txError, setTxError] = useState(false);
    const [txSuccess, setTxSuccess] = useState(false);

    const createOrder = async (
      token: string,
      bot: number,
      freq: number,
      dur: number,
      funding: number,
      fee: number
    ) => {
      if (!publicKey) return;
      setTxLoading(true);
      setTxError(false);
      setTxSuccess(false);

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
    };

    return (
      <>
        <div ref={ref} className={`modal ${showModal ? "block" : "hidden"}`}>
          <>
            <>
              <div id="mobile-bump">
                <div
                  className={`sm:hidden fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`}
                />
                <div
                  className={`sm:hidden fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${
                    showModal ? "slide-in" : ""
                  }`}
                >
                  <div className="bg-bg w-full max-w-md mx-auto rounded-xl shadow-lg text-center pb-2.5">
                    <div className="relative flex flex-col items-center">
                      <div className="left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto">
                        Create a New Bump
                      </div>
                      <div
                        className="right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80"
                        onClick={handleModal}
                      >
                        [Close]
                      </div>
                      <div className="w-full mt-10">
                        <div className="mx-5 mt-2.5">
                          <div className="mt-5 mb-3 w-full">
                            <div className="w-full flex flex-row row-span-2 bg-[#FFFFFF1A] py-2.5 px-2.5 mb-4 rounded-md text-sm">
                              <div className="w-full text-[#FFFFFF80] font-[400] text-sm">
                                <p className="flex text-start uppercase text-xs text-[#FFF] font-[550]">
                                  Bump Details
                                </p>
                                <div className="flex flex-row row-span-2 mt-1 text-xs">
                                  <div id="label" className="w-full text-start">
                                    <p className="py-0.5">Token:</p>
                                    <p className="py-0.5">Address:</p>
                                    <p className="py-0.5">Order:</p>
                                    <p className="py-0.5">Bots:</p>
                                    <p className="py-0.5">Freq:</p>
                                    <p className="py-0.5">Expiry:</p>
                                  </div>
                                  <div id="data" className="w-full text-end">
                                    <p className="text-white py-0.5 font-[600]">
                                      {tokenName} [ticker: {tokenTicker}]
                                    </p>
                                    <p className="text-white py-0.5">
                                      {formatAddress(tokenAddress)}
                                    </p>
                                    <p className="text-white py-0.5">
                                      {bot == 3 && <>Light Bump</>}
                                      {bot == 10 && <>Keep it Bumping</>}
                                      {bot == 25 && <>Max Bumping</>}
                                    </p>
                                    <p className="py-0.5 text-white">
                                      {bot == 3 && <>3 </>}
                                      {bot == 10 && <>10 </>}
                                      {bot == 25 && <>25 </>}
                                      Bots
                                    </p>
                                    <p className="py-0.5 text-white">
                                      {bot == 3 && <>60 </>}
                                      {bot == 10 && <>30 </>}
                                      {bot == 25 && <>10 </>}
                                      sec
                                    </p>
                                    <p className="py-0.5 text-white">
                                      {duration} hr
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-2 flex text-start uppercase text-xs text-[#FFF] font-[550]">
                                  Bump Pricing
                                </p>
                                <div className="flex flex-row row-span-2 text-start mt-1 text-xs">
                                  <div id="label" className="w-full text-start">
                                    <p className="py-0.5">
                                      Funding (redeemable)
                                    </p>
                                    <p className="py-0.5">Services</p>
                                  </div>
                                  <div id="data" className="w-full text-end">
                                    <p className="py-0.5 text-red">
                                      {funding} SOL
                                    </p>
                                    <p className="py-0.5 text-red">{fee} SOL</p>
                                  </div>
                                </div>
                                <div className="py-1">
                                  <div className="border-t-[1px] border-[#FFFFFF1A]" />
                                </div>
                                <div className="flex flex-row row-span-2 text-start mt-0.5">
                                  <div
                                    id="label"
                                    className="w-[25%] text-start"
                                  >
                                    <p className="font-[500]">Total:</p>
                                  </div>
                                  <div id="data" className="w-[75%] text-end">
                                    <p className=" text-red">
                                      {funding + fee} SOL
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              disabled={txSuccess}
                              onClick={() =>
                                createOrder(
                                  tokenAddress,
                                  bot,
                                  frequency,
                                  duration,
                                  funding,
                                  fee
                                )
                              }
                              className={`${
                                txSuccess
                                  ? "bg-[#FFFFFF1A] text-[#FFFFFF80]"
                                  : "text-bg bg-green hover:opacity-80"
                              } w-full rounded-md py-2 block`}
                            >
                              {txLoading ? (
                                <>
                                  <div className="flex justify-center mx-auto my-0.5">
                                    <Spinner className="w-5 h-5 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                  </div>
                                </>
                              ) : (
                                <>Create Bump</>
                              )}
                            </button>
                          </div>
                          {txError && (
                            <>
                              <span className="my-1 flex justify-center mx-auto text-xs text-red">
                                Transaction failed. Please try again.
                              </span>
                            </>
                          )}
                          {txSuccess && (
                            <>
                              <div className="my-1 flex justify-center mx-auto text-xs text-green">
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
                                  Order placed successfully!
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="desktop-bump">
                <div
                  className={`sm:fixed inset-0 z-50 backdrop-blur-sm backdrop-filter bg-[#000] bg-opacity-50`}
                />
                <div
                  className={`hidden sm:absolute inset-0 sm:flex items-center justify-center z-50 backdrop-filter backdrop-opacity-70 ${
                    showModal ? "slide-in h-screen" : ""
                  }`}
                >
                  <div className="bg-bg w-full max-w-3xl mx-auto rounded-xl shadow-lg text-center pb-2.5 border border-bg/50">
                    <div className="relative flex flex-col items-center">
                      <div className="left-5 top-3 text-xl italic absolute font-light flex justify-center mx-auto">
                        Create a New Bump
                      </div>
                      <div
                        className="right-5 top-4 text-sm absolute font-extralight flex justify-center mx-auto hover:opacity-80"
                        onClick={handleModal}
                      >
                        [Close]
                      </div>
                      <div className="w-full mt-10">
                        <div className="mx-5 mt-2.5">
                          <div className="mt-5 mb-3 w-full">
                            <div className="w-full flex flex-row row-span-2 bg-[#FFFFFF1A] py-2.5 px-2.5 mb-4 rounded-md text-sm">
                              <div className="w-[40%] h-[237.5px]">
                                <img
                                  src={tokenImage}
                                  style={{
                                    width: "90%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  alt={`${tokenName} token`}
                                />
                              </div>
                              <div className="w-[60%] text-[#FFFFFF80] font-[400] text-sm">
                                <p className="flex text-start uppercase text-xs text-[#FFF] font-[550]">
                                  Bump Details
                                </p>
                                <div className="flex flex-row row-span-2 mt-1 text-xs">
                                  <div
                                    id="label"
                                    className="w-[25%] text-start"
                                  >
                                    <p className="py-0.5">Token:</p>
                                    <p className="py-0.5">Address:</p>
                                    <p className="py-0.5">Order:</p>
                                    <p className="py-0.5">Bots:</p>
                                    <p className="py-0.5">Freq:</p>
                                    <p className="py-0.5">Expiry:</p>
                                  </div>
                                  <div id="data" className="w-[75%] text-end">
                                    <p className="text-white py-0.5 font-[600]">
                                      {tokenName} [ticker: {tokenTicker}]
                                    </p>
                                    <p className="text-white py-0.5">
                                      {formatAddress(tokenAddress)}
                                    </p>
                                    <p className="text-white py-0.5">
                                      {bot == 3 && <>Light Bump</>}
                                      {bot == 10 && <>Keep it Bumping</>}
                                      {bot == 25 && <>Max Bumping</>}
                                    </p>
                                    <p className="py-0.5 text-white">
                                      {bot == 3 && <>3 </>}
                                      {bot == 10 && <>10 </>}
                                      {bot == 25 && <>25 </>}
                                      Bots
                                    </p>
                                    <p className="py-0.5 text-white">
                                      {bot == 3 && <>60 </>}
                                      {bot == 10 && <>30 </>}
                                      {bot == 25 && <>10 </>}
                                      sec
                                    </p>
                                    <p className="py-0.5 text-white">
                                      {duration} hr
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-2 flex text-start uppercase text-xs text-[#FFF] font-[550]">
                                  Bump Pricing
                                </p>
                                <div className="flex flex-row row-span-2 text-start mt-1 text-xs">
                                  <div
                                    id="label"
                                    className="w-[40%] text-start"
                                  >
                                    <p className="py-0.5">
                                      Funding (redeemable)
                                    </p>
                                    <p className="py-0.5">Services</p>
                                  </div>
                                  <div id="data" className="w-[60%] text-end">
                                    <p className="py-0.5 text-red">
                                      {funding} SOL
                                    </p>
                                    <p className="py-0.5 text-red">{fee} SOL</p>
                                  </div>
                                </div>
                                <div className="py-1">
                                  <div className="border-t-[1px] border-[#FFFFFF1A]" />
                                </div>
                                <div className="flex flex-row row-span-2 text-start mt-0.5">
                                  <div
                                    id="label"
                                    className="w-[25%] text-start"
                                  >
                                    <p className="font-[500]">Total:</p>
                                  </div>
                                  <div id="data" className="w-[75%] text-end">
                                    <p className=" text-red">
                                      {funding + fee} SOL
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              disabled={txSuccess}
                              onClick={() =>
                                createOrder(
                                  tokenAddress,
                                  bot,
                                  frequency,
                                  duration,
                                  funding,
                                  fee
                                )
                              }
                              className={`${
                                txSuccess
                                  ? "bg-[#FFFFFF1A] text-[#FFFFFF80]"
                                  : "text-bg bg-green hover:opacity-80"
                              } w-full rounded-md py-2 block`}
                            >
                              {txLoading ? (
                                <>
                                  <div className="flex justify-center mx-auto my-0.5">
                                    <Spinner className="w-5 h-5 spinner text-[#FFFFFF80] animate-spin fill-white" />
                                  </div>
                                </>
                              ) : (
                                <>Create Bump</>
                              )}
                            </button>
                          </div>
                          {txError && (
                            <>
                              <span className="my-1 flex justify-center mx-auto text-xs text-red">
                                Transaction failed. Please try again.
                              </span>
                            </>
                          )}
                          {txSuccess && (
                            <>
                              <div className="my-1 flex justify-center mx-auto text-xs text-green">
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
                                  Order placed successfully!
                                </span>
                              </div>
                            </>
                          )}
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
    );
  }
);

export default BumpModal;
