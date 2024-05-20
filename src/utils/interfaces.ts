import mongoose from "mongoose";

export interface IOrder {
    id: number;
    client: string;
    token: string;
    bot: number;
    frequency: number;
    duration: number;
    funding: number;
    fee: number;
    wallet: mongoose.Types.ObjectId[];
    status: string;
    createdAt: Date;
    tokenName: string;
    tokenImage: string;
    tokenTicker: string;
}

export interface IWallet {
    id: number;
    pk: string;
}