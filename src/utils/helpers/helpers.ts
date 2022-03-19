import bcrypt = require('bcryptjs');

export const encrypted = async (password:string) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

export const compareEncrypted = async (password:string, encrypPassword:string) => {
    return await bcrypt.compare(password, encrypPassword);
}