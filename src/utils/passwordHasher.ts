import CryptoJS from 'crypto-js';
const SECRET_KEY = import.meta.env.VITE_REACT_APP_SECRET_KEY;

export const encryptPassword = (password:string) => {
    const encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
    return encrypted;
}
