## bdk-rn

A React Native version of the Bitcon Development Kit (https://bitcoindevkit.org/)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Library API](#library-api)

## Installation

Using npm:


```bash
npm i --save git+https://github.com/LtbLightning/bdk-rn.git
```

Using yarn:

```bash
yarn add bdk-rn@https://github.com/LtbLightning/bdk-rn.git
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

await BdkRn.generatemnemomic();
```

## Library API

All methods work in iOS: ✅

All methods work in Android: ✅

**All methods return response as follows:**

```js
const result = BdkRn.generatemnemomic();
if (result.isErr()) {
    console.error(result.error.message); // "error message"
    return;
}
const mnemonic = result.value;
```

Following methods can be used with this module. All methods can be called by **_BdkRn_** object. Parameters with asterisk(\*)\*\* are mandatory.

_BdkRn.generateMnemonic()_

| Method                                                  | Request Parameters                                                                                        |
|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| [generateMnemonic()](#generatemnemonic)                 | {entropy, length}                                                                                         |
| [createExtendedKey()](#createextendedkey)               | {network, mnemonic, password}                                                                             |
| [createXprv()](#createxprv)                             | {network, mnemonic, password}                                                                             |
| [createDescriptor()](#createdescriptor)                 | {type, mnemonic, password, network, publicKeys, threshold}                                                |
| [createWallet()](#createwallet)                         | {mnemonic,password,network,blockChainConfigUrl,blockChainSocket5,retry,timeOut,blockChainName,descriptor} |
| [getNewAddress()](#getnewaddress)                       | -                                                                                                         |
| [getBalance()](#getbalance)                             | -                                                                                                         |
| [broadcastTx()](#broadcasttx)                           | {address, amount}                                                                                         |
| [getPendingTransactions()](#getpendingtransactions)     | -                                                                                                         |
| [getConfirmedTransactions()](#getconfirmedtransactions) | -                                                                                                         |
| [getTransactions()](#gettransactions)                   | -                                                                                                         |

### generateMnemonic()

Generate random mnemonic seed phrase.
Reference: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#generating-the-mnemonic
This will generate a mnemonic sentence from the english word list.
The required entropy can be specified as the `entropy` parameter and can be in multiples of 32 from 128 to 256, 128 is used as default.
A word count or length for can be specified instead as the `length` parameter and can be in multiples of 3 from 12 to 24. 12 is used as default.

When both entropy and length are specified, entropy is used and length is ignored.

```js
// using default values
const response = await BdkRn.generateMnemonic();
// daring erase travel point pull loud peanut apart attack lobster cross surprise

// Specifying entropy of 192 which is the same as specifying length as 18
const response = await BdkRn.generateMnemonic({ entropy: 192 });
// daring erase travel point pull loud peanut apart attack lobster cross surprise actress dolphin gift journey mystery save
```

---

### createExtendedKey()

This method will create a extendedKeyInfo object using the specified mnemonic seed phrase and password
ExtendedKeyInfo creates a key object which encapsulates the mnemonic and adds a private key using the mnemonic and password.

The extended key info object is required to be passed as an argument in some bdk methods.

```js
const key = await BdkRn.createExtendedKey({
  	    network: Network.TESTNET,
	    mnemonic: 'daring erase travel point pull loud peanut apart attack lobster cross surprise',
  	    password: '',
	});

// {
// 		fingerprint: 'ZgUK9QXJRYCwnCtYL',
//		mnemonic: 'daring erase travel point pull loud peanut apart attack lobster cross surprise',
//		xpriv: 'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw'
// }
```

---

### createXprv()

create xprv using mnemonic phrase and password.

```js
const response = await BdkRn.createXprv({ network: Network.TESTNET, mnemonic: '', password: '' });
// tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw
```

---

### createDescriptor()

Create a variety of descriptors using xprv or mnemonic.

`xprv` will be used if passed otherwise `mnemonic*`, `network*` and `password` will be used.

`type` is a string and can be one of `WPKH, P2PKH, p2pkh, pkh, SHP2WPKH, shp2wpkh, p2shp2wpkh, MULTI`. `WPKH` is used as default.

If `type` is `MULTI` then need to specify the signature `threshold` and `publicKeys` array.
`path` is optional, `84'/1'/0'/0/*` is used by default

```js
const args = {
  type: '',
  mnemonic: 'tackle pause sort ten task vast candy skill retire upset lend captain',
  password: '',
  path: '',
  network: '',
  publicKeys: [],
  threshold: 4,
  xprv: '',
};
const response = await BdkRn.createDescriptor(args);
// wpkh(tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/84'/1'/0'/0/*)
```

---

### createWallet()

Initialize wallet, returns new address and current balance.

`descriptor` will be used if passed otherwise `mnemonic*`, `network*` and `password` will be used.

_createWallet with mnemonic_

```js
const response = await BdkRn.createWallet({
  mnemonic: 'daring erase travel point pull loud peanut apart attack lobster cross surprise',
  password: '',
  descriptor: '',
  network: '',
  blockChainConfigUrl: '',
  blockChainSocket5: '',
  retry: '',
  timeOut: '',
  blockChainName: '',
});
```

_createWallet with descriptor_

```js
const response = await BdkRn.createWallet({
  mnemonic: '',
  descriptor:
    'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw',
  password: '',
  network: '',
  blockChainConfigUrl: '',
  blockChainSocket5: '',
  retry: '',
  timeOut: '',
  blockChainName: '',
});
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

Get balance of wallet.

```js
const response = await BdkRn.getBalance();
// 8369
```

---

### broadcastTx()

Used to send sats to given address.

Required params: address, amount

```js
let address: string = 'tb1qhmk3ftsyctxf2st2fwnprwc0gl708f685t0j3t'; // Wallet address
let amount: number = 2000; // amount in satoshis
const response = await BdkRn.broadcastTx({ address, amount });
// 1162badd3d98b97b1c6bb7fc160b7789163c0fcaef99ad841ad8febeb1395864
```

---

### getPendingTransactions()

Get pending transactions

```js
const response = await BdkRn.getPendingTransactions();
// [{ txid: '', sent: 0, received: 0, fee: 0 }]
```

---

### getConfirmedTransactions()

Get confirmed transactions

```js
const response = await BdkRn.getConfirmedTransactions();
// [{ txid: '', block_timestamp: 0, sent: 0, block_height: 0, received: 0, fee: 0 }]
```

---

### getTransactions()

Get all confirmed and pending transactions

```js
const response = await BdkRn.getTransactions();
// { confirmed: [], pending: [] }
```

---

_Note: Caution this is pre-Alpha at this stage
Please consider reviewing, experimenting and contributing ⚡️_

Thanks for taking a look!
