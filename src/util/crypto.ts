import { EOL } from 'os'
import { Readable, Writable } from "stream";
import { PathOrFileDescriptor, readFileSync, writeFileSync } from "fs";
import { createCipheriv, createDecipheriv, getCiphers, randomFillSync, scryptSync } from "crypto";


const SALT = '123some_salt';
const ALGORITHM = 'aes-192-cbc';

export class Crypto {

    static async encrypt<T>(data: T, password: string, writable: Writable | PathOrFileDescriptor): Promise<void> {

        const algorithm = ALGORITHM;
        if (!getCiphers().includes(algorithm)) throw `Unknown cipher '${algorithm}'`;


        const data_string = JSON.stringify(data);// Stringify user data for encryption

        // Setup cipher
        const key = scryptSync(password, SALT, 24);             // for aes192, it is 24 bytes (192 bits).
        const iv = randomFillSync(new Uint8Array(16));          // Initialize random IV
        const cipher = createCipheriv(algorithm, key, iv);

        // Do the actual encryption
        let encrypted_data = cipher.update(data_string, 'utf8', 'hex');
        encrypted_data += cipher.final('hex');

        // Write results to readable stream
        const write_data: string = JSON.stringify({ iv: Array.from(iv), data: encrypted_data }) + EOL;
        await write_to_file_or_stream(write_data, writable);
    }

    static async decrypt<T>(password: string, readable: Readable | PathOrFileDescriptor): Promise<T> {
        const algorithm = ALGORITHM;
        if (!getCiphers().includes(algorithm)) throw `Unknown cipher '${algorithm}'`;


        // Read data from encrypted stream
        let stream_data;
        try {
            stream_data = await read_from_file_or_stream(readable);
        } catch (e) {
            if (e.code === 'ENOENT') throw `Unable to read file or stream, perhaps you should encypt your user data first (see the 'encrypt' comand)`;
            else throw `Unable to decrypt data, invalid password.`;
        }

        const { iv: _iv, data } = JSON.parse(stream_data);
        const iv = Uint8Array.from(_iv);// cast to Uint8Array

        // Setup cypher
        const key = scryptSync(password, SALT, 24);
        const decipher = createDecipheriv(algorithm, key, iv);

        // Do the actual decryption
        let decrypted_data = decipher.update(data, 'hex', 'utf8');
        decrypted_data += decipher.final('utf8');

        return JSON.parse(decrypted_data);
    }
}

async function write_to_file_or_stream(data: string, writable: Writable | PathOrFileDescriptor): Promise<void> {
    if (writable instanceof Writable) {
        let resolve, reject;
        const p = new Promise<void>((res, rej) => { resolve = res, reject = rej });
        writable.write(data, (err) => { if (err) reject(err); else resolve(); });
        return p;
    }
    else {
        writeFileSync(writable, data);
        return;
    }
}

/**
 * Make reading or writing from file or arbitrary stream awaitable
 * @param readable the target file or stream to read from
 * @returns 
 */
async function read_from_file_or_stream(readable: Readable | PathOrFileDescriptor): Promise<string> {
    if (readable instanceof Readable) {
        let resolve: (value: string | PromiseLike<string>) => void;
        let reject: (reason?: any) => void;
        const p = new Promise<string>((res, rej) => { resolve = res, reject = rej });

        if (!readable.readable) reject('Unreadable stream');

        let stream_data: string = '';
        
        readable.setEncoding('utf8');
        readable.on('error', reject);
        readable.on('readable', () => {
            let chunk;
            while (null !== (chunk = readable.read())) stream_data += chunk;
            resolve(stream_data);
        });

        return p;
    }
    else return readFileSync(readable).toString('utf8');
}
