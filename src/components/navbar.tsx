import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Connector from './connector'

const Navbar = () => {
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
                    </div>
                    <div className="flex">
                        <Connector />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
