import { PathOrFileDescriptor } from "fs";
import { Readable, Writable } from "stream";
import { Crypto } from "./util/crypto";

/**
 * Holds in memory, encrypts and decrypts user data to and from a file or stream.
 * For details on how the encryption and dectiption process is done check out {@link Crypto}
 */
export class MyInvestorUserDataHandler {
    static parser(json: MyInvestorUserData): MyInvestorUserData {
        const required_keys = ['user', 'password', 'device_id'];
        for (const k of required_keys) if (typeof (json as any)[k] !== 'string') throw `Invalid user data, missing required key '${k}'`;

        const { user, password, device_id, digital_signature } = json;
        return { user, password, device_id, digital_signature };
    }

    static async encrypt(data: MyInvestorUserData, password: string, writable: Writable | PathOrFileDescriptor): Promise<void> {
        return await Crypto.encrypt<MyInvestorUserData>(data, password, writable);
    }

    static async decrypt(password: string, readable: PathOrFileDescriptor | Readable): Promise<MyInvestorUserData> {
        return MyInvestorUserDataHandler.parser(await Crypto.decrypt<MyInvestorUserData>(password, readable));
    }
}

/** This interface defines the attributes needed for using the API */
export interface MyInvestorUserData {
    user: string,
    password: string,
    device_id: string, // any string, can be random or autogenerated
    digital_signature?: string // giving the digital signature means the API can be used without other user
}