import { NextApiRequest, NextApiResponse } from 'next';
import OrderMod from '@/utils/models/order';
import { connectDB } from '@/utils/connectDB';

interface ADDRESS {
    addr?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { addr } = req.query as ADDRESS
        if (!addr || addr?.length < 40 || addr?.length > 45) {
            return res.status(404).json({ error: 'Invalid Address' })
        }
        await connectDB()
        const orders = await OrderMod.find({ client: addr })
        console.log("to return", orders)
        if (!orders) {
            return res.status((500)).json({ error: 'No order found' })
        }
        res.status(200).json({ orders })
    } catch (e) {
        console.error('Error getting orders', e)
        res.status(500).json({ error: 'Error getting orders' })
    }
}
