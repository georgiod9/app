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
export const PROGRAM_ID = 'EJPQnTwg1soxB1qpYMh4B2ZRcgfVdUMghKbuH95kKLa1';
export const ACCOUNT_BOT_PK = '3zzeM1CvroTufypUduFM1t1DvPkJwNJ7BQZHz7PoKJwJ'
export const ACCOUNT_PROTOCOL_PK = 'G7h3rWk1LturxFKJrzE1723LGpc6FezVwKQGTkjTmxzt'
export const ACCOUNT_PROTOCOL_PK_dev = 'GH3AJux7zicopHnSCSHwgxhMaNeVLzUgxTNqCxS4LsRy'

