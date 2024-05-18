export const WebsiteName = "Bumpers";
export const WebsiteSlogan = "Keep your token Bumping on Pump Dot Fun";
export const WebsiteLongSlogan = "Our Bots keep your token Bumping on Pump Dot Fun. A guaranteed Radyium listing!";
export const WebsiteURL = "https://bumpers.ai/";

import * as solWeb3 from "@solana/web3.js";
//export const rpc = 'https://api.devnet.solana.com';
//export const rpc = 'https://api.mainnet-beta.solana.com';
//export const rpc = 'https://mainnet.helius-rpc.com/?api-key=0cfb2e67-5b39-4c07-af5a-c9c6d3c8271c'; //J Helius
export const rpc = 'https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b' //Pump Helius
export const solana = new solWeb3.Connection(rpc, 'confirmed');
export const contract = '8VYN9wzNhpd3Ju1TMwEMZpYdrHcrdSwGqsWWkrXeG9AS';