import * as https from 'https'

/**
 * Basic, generic API method, requires some attributes
 * and the implementation of the request() method.
 * 
 * `type: { new(value: any): T } `, means that you have to pass a new-able object (a.k.a., a class).
 *  It will use `new type()` to parse the response and return the resulting object.
 * 
 * `BaseAPIMethod` can be extended to define more complex requests. but a basic implementation is given by the {@link APIMethod} generic class.
 */
export abstract class BaseAPIMethod {
    protected abstract path: string
    protected abstract method: string // POST, GET, etc.
    protected abstract body?: string

    constructor(protected token?: string, protected device_id?: string, protected signature?: string) { }

    abstract request(...args: any): Promise<any>
}


/**
 * Generic, abstract class to simplify the api method implementation.
 * 
 * Requires `path`, `method`, `body` and `request()` to be defined when this abstract class is implemented.
 * Check out an exmaple class that implements an api call:
 * 
 * @example
 * ```
 * 
 * class APIResponse {// Parser for the response body
 *     my_name: string
 *     constructor(values: any) { this.my_name = values.response_name; }
 * }
 * 
 * class APIRequest extends APIMethod {
 *     path = 'https://my.api.test/get/name'
 *     method = 'GET'
 *     body = JSON.stringify({ user: 'john' })
 *     async request() { return await this._request(APIResponse); }
 * }
 * 
 * const x = await new APIRequest('some_token').request() // {my_name: 'John Doe'}
 * ```
 * Or if you are in the mood for some TypeScript fuckery:
 * @example
 * ```
 * function cat(values: any) {
 *     let object = {}
 *     console.log('nicer')
 *     object.lol = 'nice'
 *     return object
 * }
 * 
 * class CatRequest extends APIMethod {
 *     path = 'https://my.api.test/get/cats'
 *     method = 'GET'
 *     body = JSON.stringify({ please: 'and thank you' })
 *     async request() { return await this._request(cat as any) as typeof cat; }
 * }
 * 
 * const y = await new CatRequest('some_token').request() // {lol: 'nice'}
 * ```
 */
abstract class APIMethod extends BaseAPIMethod {
    protected async _request<T>(type: { new(value: any): T; }, ): Promise<T> {
        // Initialize and awaitable promis
        let resolve: (value: T | PromiseLike<T>) => void;
        let reject: (reason?: any) => void;
        const p = new Promise<T>((rs, rj) => { resolve = rs; reject = rj; })

        // setup the request endpoint, method and headers
        const options: https.RequestOptions = {
            hostname: 'app.myinvestor.es',
            port: 443,
            path: this.path.toString(),
            method: this.method,
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0",
                'Content-Type': 'application/json',
                "Accept": '*/*',
                'Cache-Control': 'no-cache',
                'Host': 'app.myinvestor.es',
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                'Content-Length': this.body?.length || 0,
            }
        }

        if (this.token) options.headers.Authorization = `: Basic ${this.token}`;

        // Resolve/reject the promise depending on the answer
        const req = https.request(options, (res) => {
            if (res.statusCode !== 200) { reject(`${this.path}: (${res.statusCode}) ${res.statusMessage || '[No status message]'}`); return; }
            let body = "";
            res.on('data', d => { body += d });
            res.on('end', () => {
                try { resolve(new type(JSON.parse(body))) }
                catch (e) { reject(e) }
            });
            res.on('error', reject);
        });
        req.on('error', reject);
        req.write(this.body);
        req.end();

        return p;
    }
}

export abstract class PrivateAPIMethod extends APIMethod {
    constructor(token: string) { super(token) }
}

export abstract class PrivateWithIDAPIMethod extends APIMethod {
    constructor(token: string, protected device_id: string) { super(token, device_id) }
}

export abstract class PrivateFullAPIMethod extends APIMethod {
    constructor(token: string, protected device_id: string, protected signature: string) { super(token, device_id, signature) }
}

export abstract class PublicAPIMethod extends APIMethod {
    constructor() { super(undefined, undefined) }
}