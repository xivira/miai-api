# MyInvestor Account Interface (API)

<h2 id="about-the-project">ℹ️ About The Project</h2>

MyInvestor Account Interface API offers an easy to use interface for [MyInvestor](https://myinvestor.es/) with TypeScript support.

<h2 id="installing">⬇️ Installing</h2>

To add it to your project simply run `npm install miai-api`.

<h2 id="documentation">📚 Documentation</h2>

## Importing the API

MIAI exports 4 main classes that allows for ESM-only import declarations.

```js
import { MyInvestorAPI, MyInvestorAuthenticator, Auth, MyInvestorUserDataHandler } from 'miai-api';
// const { MyInvestorAPI, MyInvestorAuthenticator, Auth, MyInvestorUserDataHandler } = require('miai-api');// Won't work!
```

## Getting your _token_

Before the API can be initialized, we must get the access token. You can get it with the static `requestToken` and `validateAuthOTP` methods found on the `MyInvestorAPI` class:

```js
const data = {
  user: 'example',
  password: 'hunter32',
  device_id: (Math.random()*10000).toString() // This can be string, will require validaton the first time its used to request a token
}

// Try to authenticate
const auth_response = await MyInvestorAPI.requestToken(data.user, data.password, data.device_id);
if (!auth_response.success) throw response.failure_reason || 'invalid user or password'
if (auth_response.access_token) return auth_response.access_token;// device_id is already verified. Success!

// If the device_id is new and needs to be validated, the user receives and SMS with the validation code.
// For simplicity's sake we asume there is a magic function getUserInput()
const code = getUserInput();

let response = await MyInvestorAPI.validateAuthOTP(data.user, data.password, data.device_id, auth_response.opt_request_id, code);
if (!auth_response.success) throw response.failure_reason || 'invalid opt code'
return response.access_token;// Success!
```

The login process is tedious and error prone. Therefore, the `MyInvestorAuthenticator` class is offered, simplifying the process:

```js
const auther = new MyInvestorAuthenticator(data);

const auth_response = await auther.getToken();

if(auth_response.token) return token;// Success!

const code = getUserInput();

return await auther.validateOTP(code).token;// Success!
```

## Initializing the _API_

Once we have the authentication token, we can initialize the API. From there on we can use the exposed methods as desired. Most of them are pretty self explanatory.

```js
const api = new MyInvestorAPI(token);
```
## Handling _user data_

Handling user data is not always trivial. `MyInvestorUserDataHandler` class can help with safely storing user data if that is what we want to do. It is very opinionated as to how it works. It encrypts and decrypts the user data with the `AES-192` cypher, salted and with an initialization vector to offer maximum security.

User data comprises of 4 attibutes:

| Attirbute |                                              Usage                                              |
+-----------+-------------------------------------------------------------------------------------------------+
| user      | MyInvestor username used for logging in                                                         |
| password  | MyInvestor password used for logging in                                                         |
| device_id | Login identification. It can be any string. Each unique string must be validated via OTP (SMS). |
| signature | MyInvestor signature used for validating operations (purchace, cancel orders)                   |

> NOTE: The *signature* attribute is optional and ideally user input should be required for validating each purchase.

```js
const data = {
  user: 'example',
  password: 'hunter32',
  device_id: 'some_id',
  signature: 'my_signature'
}

const file = 'data.encrypted.json'

await MyInvestorUserDataHandler.encrypt(data, 'safe_password', file);

const encrypted_data = JSON.parse(readFileSync(file));

console.log(encrypted_data.iv); // Intialization Vector
console.log(encrypted_data.data); // Unreadable gibberish

const recovered_data = await MyInvestorUserDataHandler.decrypt('safe_password', file);

deepEquals(data, recovered_data); // true
```



## Working with the API

Most api functions are queries about account data or financial products. This are pretty self explanatory and the code is self-decriptive. However, non-query orders which involve actual money are protected by requiring a validation with signature before each operation. For details on how `MyInvestorAPI.ìnvest` and `MyInvestorAPI.cancel` api methods work, check out the `MyInvestorAPI.fullInvest` and `MyInvestorAPI.fullCancel` methods which describe by example how it should be done.

<h2 id="build">🔨 Building </h2>

Install [`node` and `npm`](https://nodejs.org/en/download/). Run `npm install` before using `npm run build` to build the library from source.

### Built With

* [Node JS](https://nodejs.org), portable executable environment
* [TypeScript](https://www.typescriptlang.org/), typing extension for JavaScript for developing more robust code