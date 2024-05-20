import dotenv from 'dotenv';
dotenv.config();

export const getEnv = (varName: any) => {
    const variable = process.env[varName] || '';
    return variable;
}