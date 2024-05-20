import mongoose from "mongoose"
import { MONGODB_URI } from "@/constants"

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('connected')
    } catch (e) {
        console.log('ERROR | DB / CONNEXION ERROR =', e)
    }
}