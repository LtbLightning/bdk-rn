## bdk-rn

A React Native version of the Bitcon Development Kit (https://bitcoindevkit.org/)

Current version uses...
1. v0.5.2 of https://github.com/bitcoindevkit/bdk-kotlin Which is based on v0.5.0 of https://github.com/bitcoindevkit/bdk-ffi
2. v0.2.0 of https://github.com/bitcoindevkit/bdk-swift which is based on v0.3.1 of https://github.com/bitcoindevkit/bdk-ffi

Caution ⚠️ This is a pre-⍺ version
Please consider reviewing, experimenting and contributing ⚡️

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Library API](#library-api)

## Installation

Not available in package manager yet so please either clone locally and install or from github:

Clone in bdk-rn folder locally and specify folder in package.json:

```
"bdk-rn": "file:./bdk-rn"
```
or directly via github:
```
"bdk-rn": "git+https://github.com/LtbLightning/bdk-rn.git"
```
Once bdk-rn is specified in package.json proceed to run npm i

Using npm:

```bash
$ npm i bdk-rn @react-native-async-storage/async-storage
```

Using yarn:

```bash
$ yarn add bdk-rn @react-native-async-storage/async-storage
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

await BdkRn.walletExists();
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

_BdkRn.walletExists()_ OR _BdkRn.genSeed()_

| Method                            | Request Parameters                                |
| --------------------------------- | ------------------------------------------------- |
| [genSeed()](#genseed)             | password                                          |
| [walletExists()](#walletexists)   | -                                                 |
| [unlockWallet()](#unlockwallet)   | -                                                 |
| [createWallet()](#createwallet)   | mnemonic, password                                |
| [restoreWallet()](#restorewallet) | mnemonic\*, password                              |
| [resetWallet()](#resetwallet)     | -                                                 |
| [getNewAddress()](#getnewaddress) | -                                                 |
| [getBalance()](#getbalance)       | -                                                 |
| [broadcastTx()](#broadcasttx)     | address*(recipient wallet address), amount*(sats) |

---

### genSeed()

Generate random 12 words seed.

```js
const response = await BdkRn.genSeed();
// daring erase travel point pull loud peanut apart attack lobster cross surprise
```

---

### walletExists()

Check if wallet already exists or not.

```js
const response = await BdkRn.walletExists();
// true | false
```

---

### unlockWallet()

Unlock wallet if already exists.

```js
const response = await BdkRn.unlockWallet();
// true | false
```

---

### createWallet()

Create new wallet.

User can specify their custom mnemonic and password OR can generate from genSeed() method and pass to createWallet.
If mnemonic and password are not passed then mnemonic will be generate automatically and empty password will be applied to createWallet.
Return mnemonic and new address after successful of createWallet.

```js
const response = await BdkRn.createWallet(mnemonic, password);
```

Returned response example:

```js
{
  "data": {
    "address": "tb1qxg8g8cdzgs09cttu3y7lc33udqc4wsesunjnhe",
    "mnemonic": "clown habit life issue grief knee wide flash club sea card control"
  },
  "error": false
}
```

---

### restoreWallet()

_mnemonic is required param. password is optional but must applied if passed while createWallet_.

Restore existing wallet and return new wallet address and current balance.

```js
const response = await BdkRn.restoreWallet(mnemonic, password);
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

### resetWallet()

Wipe out everything from app either created new wallet or restored existing one.

```js
const response = await BdkRn.resetWallet();
// true | false
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
let address = 'tb1qhmk3ftsyctxf2st2fwnprwc0gl708f685t0j3t'; // Wallet address
let amount = '2000'; // amount in satoshis
const response = await BdkRn.broadcastTx(address, amount);
```

```js
{
  "data": "1162badd3d98b97b1c6bb7fc160b7789163c0fcaef99ad841ad8febeb1395864", // transaction id
  "error": false
}
```

---

_Note: Caution this is pre-Alpha at this stage
Please consider reviewing, experimenting and contributing ⚡️_

Thanks for taking a look!
