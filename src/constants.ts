export const WebsiteName = "Bumpers";
export const WebsiteSlogan = "Keep your token Bumping on Pump Dot Fun";
export const WebsiteLongSlogan = "Our Bots keep your token Bumping on Pump Dot Fun. A guaranteed Radyium listing!";
export const WebsiteURL = "https://bumpers.ai/";

import { getEnv } from "./utils/utils";
export const MONGODB_URI = getEnv('MONGODB_URI')

import * as solWeb3 from "@solana/web3.js";
// SOLANA MAINNET - NETWORK CONFIG
export const NETWORK = 'mainnet-beta'
export const RPC = 'https://lingering-damp-lambo.solana-mainnet.quiknode.pro/41ced52afd17c1798eb1b6524ae12a981521a1d4'
//export const RPC = 'https://api.mainnet-beta.solana.com';

// SOLANA DEVNET - NETWORK CONFIG
//export const NETWORK = 'devnet'
//export const RPC = 'https://api.devnet.solana.com'

export const SOLANA = new solWeb3.Connection(RPC, 'confirmed');
export const PROGRAM_ID = '2kptyUB75N4fZE7FfkMpC1qxoM6VWJ26HN95QFDgN9P4';
export const ACCOUNT_BOT_PK = '3KW9UmB16bpCE7qayxgixXj43vXVqAwEZp5aeFxNSyGU'
export const ACCOUNT_PROTOCOL_PK = 'sr8S4uYAcCvgDWBr1QHsTNU5ftf8NR4JakSb7QShBUh' 
