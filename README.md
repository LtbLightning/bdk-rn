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

| Method                                                  | Request Parameters                                           |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| [generateMnemonic()](#generatemnemomic)                 | {entropy, length}                                            |
| [createExtendedKey()](#createextendedkey)               | {network, mnemonic, password}                                |
| [createXprv()](#createxprv)                         | {network, mnemonic, password}                                |
| [createDescriptor()](#createdescriptor)                 | {type, useMnemonic, mnemonic, password, network, publicKeys, thresold} |
| [createWallet()](#createWallet)                         | {mnemonic,password,network,blockChainConfigUrl,blockChainSocket5,retry,timeOut,blockChainName,descriptor,useDescriptor} |
| [getNewAddress()](#getnewaddress)                       | -                                                            |
| [getBalance()](#getbalance)                             | -                                                            |
| [broadcastTx()](#broadcasttx)                           | {address, amount}                                            |
| [getPendingTransactions()](#getpendingtransactions)     | {address, amount}                                            |
| [getConfirmedTransactions()](#getconfirmedtransactions) | {address, amount}                                            |



### generateMnemomic()

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
  	network: Network.TESTNET
		mnemonic: 'daring erase travel point pull loud peanut apart attack lobster cross surprise',
  	password: ''
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

`useMnemonic` can be true or false. `mnemonic_` and `*password*` are mandatory when `useMnemonic` is set to `true` else need to pass value in `xprv`.

`type` is a string and can be one of `WPKH, P2PKH, p2pkh, pkh, SHP2WPKH, shp2wpkh, p2shp2wpkh, MULTI`. `WPKH` is used as default.

If `type` is `MULTI` then need to specufy the signature  `thresold` and `publicKeys` array.
`path` is optional, `84'/1'/0'/0/*` is used by default 

```js
const args = {
  type: '',
  useMnemonic: true,
  mnemonic: 'tackle pause sort ten task vast candy skill retire upset lend captain',
  password: '',
  path: '',
  network: '',
  publicKeys: [],
  thresold: 4,
  xprv: '',
};
const response = await BdkRn.createDescriptor(args);
// wpkh(tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/84'/1'/0'/0/*)
```

---

### createWallet()

Initialize wallet, returns new address and current balance.

_*useDescriptor*_ is ethier true or false. Need to pass value in _descriptor_ field if set True else need to pass value in _mnemonic_.

_createWallet with mnemonic_

```js
const response = await BdkRn.createWallet({
  mnemonic: 'daring erase travel point pull loud peanut apart attack lobster cross surprise',
  password: '',
  descriptor: '',
  useDescriptor: false,
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
  useDescriptor: true,
  password: '',
  network: '',
  blockChainConfigUrl: '',
  blockChainSocket5: '',
  retry: '',
  timeOut: '',
  blockChainName: '',
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
