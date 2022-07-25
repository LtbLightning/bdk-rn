## bdk-rn

A React Native version of the Bitcon Development Kit (https://bitcoindevkit.org/)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Library API](#library-api)

## Installation

Using npm:

```bash
$ npm i git+https://github.com/LtbLightning/bdk-rn.git
```

Using yarn:

```bash
$ yarn add https://github.com/LtbLightning/bdk-rn.git
```


[IOS Only] Install pods:

```bash
npx pod-install
or
cd ios && pod install
```

## Usage

```js
import BdkRn from 'bdk-rn';

// ...

await BdkRn.genSeed({ password: '' });
```

## Library API

All methods work in iOS: ✅

All methods work in Android: ✅

**All methods return response as follows:**

```js
Promise<Response> = {
  error: true | false; // Method call success return true else return false.
  data: string | object | any; // Different response data based on method call.
}
```

Following methods can be used with this module. All methods can be called by **_BdkRn_** object. Parameters with asterisk(\*)\*\* are mandatory.

_BdkRn.genSeed({password: ''})_

| Method                                  | Request Parameters                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [genSeed()](#genseed)                   | {password}                                                                                                              |
| [createDescriptor()](#createdescriptor) | {seed, password}                                                                                                        |
| [initWallet()](#initwallet)             | {mnemonic,password,network,blockChainConfigUrl,blockChainSocket5,retry,timeOut,blockChainName,descriptor,useDescriptor} |
| [getNewAddress()](#getnewaddress)       | -                                                                                                                       |
| [getBalance()](#getbalance)             | -                                                                                                                       |
| [broadcastTx()](#broadcasttx)           | {address, amount}                                                                                                       |
| [getPendingTransactions()](#getpendingtransactions)             | {address, amount}                                                                                                       |
| [getConfirmedTransactions()](#getconfirmedtransactions)            | {address, amount}                                                                                                       |

---

### genSeed()

Generate random 12 words seed.

```js
const response = await BdkRn.genSeed({ password: '' });
// daring erase travel point pull loud peanut apart attack lobster cross surprise
```

---

### createDescriptor()

Create descriptor using seed and password.

```js
const response = await BdkRn.createDescriptor({ seed: '', password: '' });
// tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw
```

---

### initWallet()

Initialize wallet, returns new address and current balance.

_*useDescriptor*_ is ethier true or false. Need to pass value in _descriptor_ field if set True else need to pass value in _mnemonic_.

_Init with mnemonic_

```js
const response = await BdkRn.initWallet({
  mnemonic: 'daring erase travel point pull loud peanut apart attack lobster cross surprise',
  password: '',
  network: '',
  blockChainConfigUrl: '',
  blockChainSocket5: '',
  retry: '',
  timeOut: '',
  blockChainName: '',
  descriptor: '',
  useDescriptor: false,
});
```

_Init with descriptor_

```js
const response = await BdkRn.initWallet({
  mnemonic: '',
  password: '',
  network: '',
  blockChainConfigUrl: '',
  blockChainSocket5: '',
  retry: '',
  timeOut: '',
  blockChainName: '',
  descriptor:
    'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw',
  useDescriptor: true,
});
```

Returned response example:

```js
{
  "data": {
    "address": "tb1qxg8g8cdzgs09cttu3y7lc33udqc4wsesunjnhe",
    "balance": "0" // in sats
  },
  "error": false
}
```

---

### getNewAddress()

Create new address for wallet.

```js
const response = await BdkRn.getNewAddress();
// tb1qew48u6cfxladqpumcpzl0svdqyvc9h4rqd3dtw
```

---

### getBalance()

Get balace of wallet.

```js
const response = await BdkRn.getBalance();
```

```js
{
  "data": "8369", // balance in sats
  "error": false
}
```

---

### broadcastTx()

Used to send sats to given address.

Required params: address, amount

```js
let address: string = 'tb1qhmk3ftsyctxf2st2fwnprwc0gl708f685t0j3t'; // Wallet address
let amount: number = 2000; // amount in satoshis
const response = await BdkRn.broadcastTx({ address, amount });
```

```js
{
  "data": "1162badd3d98b97b1c6bb7fc160b7789163c0fcaef99ad841ad8febeb1395864", // transaction id
  "error": false
}
```

---

### getPendingTransactions()

Get pending transactions

```js
const response = await BdkRn.getPendingTransactions();
```

```js
[{}];
```

---

### getConfirmedTransactions()

Get confirmed transactions

```js
const response = await BdkRn.getConfirmedTransactions();
```

```js
[{}];
```

---

_Note: Caution this is pre-Alpha at this stage
Please consider reviewing, experimenting and contributing ⚡️_

Thanks for taking a look!
