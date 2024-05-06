import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface Coin {
    coin?: string;
}

// https://client-api-2-74b1891ee9f9.herokuapp.com/coins/dYvcpv8aSJtRhwMResYwvonEB2rM52AuBXhFZcV882c

// COINS EXAMPLES 👇
// 4b1L4rxkaH1aefRmQewqX9hbKhwUHCPG5FVivtHRejkX
// dYvcpv8aSJtRhwMResYwvonEB2rM52AuBXhFZcV882c

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { coin } = req.query as Coin
        const pumpfunApi = `https://client-api-2-74b1891ee9f9.herokuapp.com/coins/${coin}`
        const response = await axios.get(pumpfunApi)
        const coinData = response.data
        res.status(200).json({ coinData })
    } catch (e) {
        console.error('Error fetching coin from pump.fun', e)
        res.status(500).json({ error: 'Error fetching coin from pump.fun' })
    }
}
