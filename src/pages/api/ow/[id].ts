import { NextApiRequest, NextApiResponse } from 'next';
import OrderMod from '@/utils/models/order';
import WalletMod from '@/utils/models/wallet';
import { connectDB } from '@/utils/connectDB';

interface ID {
    id?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query as ID
        console.log(id)
        if (!id) {
            return res.status(404).json({ error: 'Invalid ID' })
        }
        await connectDB()

        // TODO - To remplace with a most optimized schema

        const order = await OrderMod.findOne({ id: id })
        console.log(order)
        if (!order) {
            return res.status(500).json({ error: 'No order found' })
        }
        let pk = []
        let i
        console.log('ok here')
        for (i = 0; order.wallet.length > i; i++) {
            const wallet = await WalletMod.findById({ _id: order.wallet[i]._id })
            pk.push(wallet.publicKey)
        }
        console.log("to return", pk)
        res.status(200).json({ pk })
    } catch (e) {
        console.error('Error getting pk', e)
        res.status(500).json({ error: 'Error getting pk' })
    }
}
