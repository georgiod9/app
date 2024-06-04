export type CoinData = {
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
}

export type OrderData = {
    id: number,
    placed: number,
    owner: string,
    tokenAddress: string,
    tokenName: string,
    tokenTicker: string,
    tokenImage: string,
    bumpPackage: number,
    botNbr: number,
    frequency: number,
    duration: number,
    funding: number,
    status: string,
    fee: number,
}

export type OrderStateData = {
    pk: string[],
}

export type ConnectModalRefType = HTMLDivElement | null

export type BumpModalRefType = HTMLDivElement | null

export type OrderStateModalRefType = HTMLDivElement | null

export type HowItWorksModalRefType = HTMLDivElement | null