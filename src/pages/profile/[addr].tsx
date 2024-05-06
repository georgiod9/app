import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { WebsiteName, WebsiteSlogan, WebsiteURL } from '@/constants'
import Navbar from '@/components/navbar'
// import Insight from '@/components/insight'
import { useWallet } from '@solana/wallet-adapter-react';

const Profile = () => {

    const router = useRouter()
    const { addr } = router.query as { addr: string }
    const { connected, publicKey } = useWallet()

    const bumpData = useState([])
    const [bumpDataLoaded, setBumpDataLoaded] = useState(false)

    useEffect(() => {
        if (addr && connected && publicKey) {
            const base58 = publicKey.toBase58()
            if (addr == base58) {
                //alert('load bumpdata for user')
            } else { router.push('/') }
        } else {
            router.push('/')
        }
    }, [addr, connected, publicKey])

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
            <div className="md:flex md:flex-row md:row-span-2 items-center justify-center h-[100vh] mt-20 md:mt-0">
                <div className='flex justify-center mx-auto w-full md:w-1/2 pt-2 pb-5'>
                    <div id='bump-form' className='bg-[#2E303A] rounded-md md:w-[60%] w-full mx-4'>
                        <div className='mx-4 mt-3 mb-5'>
                            <h2 className='mb-4 text-lg italic font-light flex justify-start mx-auto'>
                                Pumbers
                            </h2>
                            {bumpDataLoaded ? <></> : <></>}
                            {bumpData.length > 0 ?
                                <>
                                    <div id='no-bump' className='w-full h-[530px] rounded-md bg-[#FFFFFF1A] mt-2 px-2 py-2 flex items-center justify-center'>
                                        <div className='text-[#FFF] text-xs md:text-sm text-center w-full'>
                                            <span className='font-[600]'>No Pumbers yet!</span>
                                            <div className='mt-10 flex justify-center mx-auto'>
                                                <button
                                                    // onClick={() => handleBumpModal()} 
                                                    className='text-bg bg-green w-[80%] rounded-md py-3 hover:opacity-80 md:hidden block'>+ Add New Bump</button>
                                                <button onClick={() => router.push('/')} className='text-bg bg-green w-[60%] rounded-md py-3 hover:opacity-80 hidden md:block'>+ Add New Bump</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div id='bump' className='w-full rounded-md bg-[#FFFFFF1A] mt-2 px-2 py-2'>
                                        <div className='h-80'>
                                            <div className='h-full w-full items-center block'>
                                                <div className='flex font-[400]'>
                                                    <span className='text-[#FFF] text-xs md:text-sm text-center mx-auto justify-center flex items-center'>No Pumbers yet!</span>
                                                </div>
                                                <div className='mt-4 mb-2.5 flex justify-center mx-auto'>
                                                    <button
                                                        // onClick={() => handleBumpModal()} 
                                                        className='text-bg bg-green w-full rounded-md py-2 hover:opacity-80 md:hidden block'>Add New Bumper</button>
                                                    <button onClick={() => router.push('/')} className='text-bg bg-green w-[60%] rounded-md py-2 hover:opacity-80 hidden md:block'>+ Add New Bump</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Profile
