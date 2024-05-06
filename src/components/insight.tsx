import React from 'react'
import Image from 'next/image'

const Insight = () => {
    return (
        <>
            <div id='insights' className='block'>
                <span id='ins-1' className="mt-2.5 mb-2.5 text-sm flex items-center justify-start mx-0 sm:mx-1 text-bg bg-red p-1.5 py-2 px-2.5 rounded-md w-fit">
                    <Image src={"/assets/pepe.svg"} alt='Pepe Logo' width={27} height={27} className="" fetchPriority='auto' />
                    <span className="pl-2.5 font-[600]">BFUS</span>
                    <span className="pl-2.5 font-[400] pr-0.5">sold 0.92 SOL of Bump</span>
                    <span className="ml-auto"></span>
                </span>
                <span id='ins-2' className="mt-2.5 mb-2.5 text-sm flex items-center justify-start mx-0 sm:mx-1 text-bg bg-blue p-1.5 py-2 px-2.5 rounded-md w-fit">
                    <Image src={"/assets/pepe.svg"} alt='Pepe Logo' width={27} height={27} className="" fetchPriority='auto' />
                    <span className="pl-2.5 font-[600]">GKLA</span>
                    <span className="pl-2.5 font-[400] pr-0.5">bought 6.43 SOL of Bump</span>
                    <span className="ml-auto"></span>
                </span>
                <span id='ins-3' className="mt-2.5 mb-2.5 text-sm flex items-center justify-start mx-0 sm:mx-1 text-bg bg-yellow p-1.5 py-2 px-2.5 rounded-md w-fit">
                    <Image src={"/assets/pepe.svg"} alt='Pepe Logo' width={27} height={27} className="" fetchPriority='auto' />
                    <span className="pl-2.5 font-[600]">HG8H</span>
                    <span className="pl-2.5 font-[400] pr-0.5">bought 1.12 SOL of Bump</span>
                    <span className="ml-auto"></span>
                </span>
                <span id='ins-4' className="mt-2.5 mb-2.5 text-sm hidden sm:flex items-center justify-start mx-0 sm:mx-1 text-bg bg-green p-1.5 py-2 px-2.5 rounded-md w-fit">
                    <Image src={"/assets/pepe.svg"} alt='Pepe Logo' width={27} height={27} className="" fetchPriority='auto' />
                    <span className="pl-2.5 font-[600]">APP88</span>
                    <span className="pl-2.5 font-[400] pr-0.5">bought 0.0689 SOL of Bump</span>
                    <span className="ml-auto"></span>
                </span>
                <span id='ins-5' className="mt-2.5 mb-2.5 text-sm hidden sm:flex items-center justify-start mx-0 sm:mx-1 text-bg bg-red p-1.5 py-2 px-2.5 rounded-md w-fit">
                    <Image src={"/assets/pepe.svg"} alt='Pepe Logo' width={27} height={27} className="" fetchPriority='auto' />
                    <span className="pl-2.5 font-[600]">BFUS</span>
                    <span className="pl-2.5 font-[400] pr-0.5">sold 0.521 SOL of Bump</span>
                    <span className="ml-auto"></span>
                </span>
                <span id='ins-6' className="mt-2.5 mb-2.5 text-sm hidden sm:flex items-center justify-start mx-0 sm:mx-1 text-bg bg-blue p-1.5 py-2 px-2.5 rounded-md w-fit">
                    <Image src={"/assets/pepe.svg"} alt='Pepe Logo' width={27} height={27} className="" fetchPriority='auto' />
                    <span className="pl-2.5 font-[600]">GKLA</span>
                    <span className="pl-2.5 font-[400] pr-0.5">bought 0.851 SOL of Bump</span>
                    <span className="ml-auto"></span>
                </span>
            </div>
        </>
    )
}

export default Insight
