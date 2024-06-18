import jsSHA from "jssha";
import CryptoJS from 'crypto-js';

// Generar code_verifier
export function generateCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return base64url(array);
}

// Función para convertir un ArrayBuffer a base64url (mismo que antes)
function base64url(source) {
    // Convertir ArrayBuffer a String
    let encodedSource = btoa(String.fromCharCode.apply(null, new Uint8Array(source)));
    // Reemplazar caracteres + y / por - y _, respectivamente. Remover = al final.
    encodedSource = encodedSource.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return encodedSource;
}

// Generar code_challenge a partir de code_verifier usando jsSHA
export async function generateCodeChallenge(code_verifier) {
    const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
    shaObj.update(code_verifier);
    const hash = shaObj.getHash("ARRAYBUFFER");
    return base64url(hash);
}

// Función para generar el hash SHA-256 de un texto
export const calculateHash = (text) => {
    // Crea una instancia de jsSHA para calcular el hash
    const shaObj = new jsSHA('SHA-256', 'TEXT');
    // Actualiza el valor de entrada
    shaObj.update(text);
    // Calcula el hash y lo devuelve en formato hexadecimal
    return shaObj.getHash('HEX');
};

export const encrypt = (codeVerifier) => {
    const passphrase = 'tu passphrase secreto';  // Usa una llave secreta segura y guárdala adecuadamente
    return CryptoJS.AES.encrypt(codeVerifier, passphrase).toString();
};

export const decryptCodeVerifier = (cipherText) => {
    const passphrase = 'tu passphrase secreto';
    const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
};