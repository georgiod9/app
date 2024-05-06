import Head from "next/head";
import { WebsiteSlogan, WebsiteName, WebsiteURL } from "@/constants";

export default function NotFound() {
    return (
        <>
            <Head>
                <title>{"Page not found | " + WebsiteName}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={WebsiteSlogan} />
                <meta name="robots" content="nofollow, noindex" />
                <link rel="canonical" href={`${WebsiteURL}/404`} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={"Page not found | " + WebsiteName} />
                <meta property="og:description" content={WebsiteSlogan} />
                <meta property="og:image" content={`${WebsiteURL}/og.jpg`} />
            </Head>
            <div className="pt-48 pb-10">
                <h1 className="text-[80px] font-extrabold mx-auto flex justify-center">404</h1>
                <h2 className="text-[25px] font-semibold mx-auto flex justify-center">Page not found</h2>
                <p className="text-xs font-light mx-auto flex justify-center">The page you are looking for does not exist.</p>
            </div>
            <div className="flex mx-auto justify-center">
                <a href="/" className="font-[550] text-sm rounded-md border border-white py-1.5 px-5">
                    Return Home
                </a>
            </div>
        </>
    );
}
