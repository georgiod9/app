import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Connector from './connector'

import HowItWorksModal from '@/components/modals/howitworks';
import { type HowItWorksModalRefType } from '@/utils/types';

const Navbar = () => {

    const HowItWorksModalRef = useRef<HowItWorksModalRefType>(null)
    const [isHowItWorksModalOpen, setHowItWorksModalOpen] = useState(false)

    const handleHowItWorksModal = () => {
        setHowItWorksModalOpen(prevState => !prevState)
    }


    return (
        <>
            <nav className="fixed top-0 max-w-screen h-nav-height pt-3 md:pt-2.5 pb-2.5 w-full z-50 bg-bg">
                <div className="flex justify-between mx-2.5 md:mx-5">
                    <div className="flex">
                        <Link href="/" className="md:pt-[5px] pt-[3px]">
                            <Image
                                src="/logo.svg"
                                width={120}
                                height={1}
                                alt="Bumpers Logo"
                                fetchPriority='high'
                            />
                        </Link>
                        <span onClick={() => handleHowItWorksModal()} className='pt-1.5 font-light hover:text-white/80 text-[13px] ml-4 hidden md:block'>[How it works]</span>
                    </div>
                    <div className="flex">
                        <Connector />
                    </div>
                </div>
                <span onClick={() => handleHowItWorksModal()} className='pt-2.5 font-light hover:text-white/80 text-[13px] w-full justify-start mx-2.5 md:hidden flex'>[How it works]</span>
            </nav>
            <>
                {isHowItWorksModalOpen && <><HowItWorksModal showModal={isHowItWorksModalOpen} closeModal={handleHowItWorksModal} ref={HowItWorksModalRef} /></>}
            </>
        </>
    )
}

export default Navbar
