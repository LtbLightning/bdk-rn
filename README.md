## bdk-rn

<p>
  <a href="https://github.com/LtbLightning/bdk-rn/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="BDK RN is released under the MIT license." />
  </a>
  <a href="https://github.com/LtbLightning/bdk-rn/blob/main/README.md">
    <img src="https://img.shields.io/badge/docs-red.svg" alt="Docs" />
  </a>
  <a href="https://www.npmjs.com/package/bdk-rn">
    <img src="https://img.shields.io/npm/v/bdk-rn" alt="Current npm package version." />
  </a>
    <a href="https://github.com/LtbLightning/bdk-rn/issues">
    <img src="https://img.shields.io/github/issues/LtbLightning/bdk-rn.svg" alt="Issues" />
  </a>
  <a href="https://github.com/LtbLightning/bdk-rn/stargazers">
    <img src="https://img.shields.io/github/stars/LtbLightning/bdk-rn.svg" alt="Stars" />
  </a>
  <a href="https://github.com/LtbLightning/bdk-rn/forks">
    <img src="https://img.shields.io/github/forks/LtbLightning/bdk-rn.svg?color=brightgreen" alt="Forks" />
  </a>
  <a href="https://github.com/LtbLightning/bdk-rn-app">
    <img src="https://img.shields.io/badge/Demo App-orange" alt="Demo App" />
  </a>
</p>

A React Native version of the Bitcoin Development Kit (https://bitcoindevkit.org/)
`bdk` aims to be the core building block for Bitcoin Applications of any kind.

## Installation

Using npm:

```bash
npm i --save bdk-rn
```

Using yarn:

```bash
yarn add bdk-rn
```

[IOS Only] Install pods:

```bash
npx pod-install
or
cd ios && pod install
```

### Examples

### Create a Wallet & sync the balance of a descriptor

```ts
import { DescriptorSecretKey, Mnemonic, Blockchain, Wallet, DatabaseConfig, Descriptor } from 'bdk-rn';
import { WordCount, Network } from 'bdk-rn/lib/lib/enums';

// ....

const mnemonic = await new Mnemonic().create(WordCount.WORDS12);
const descriptorSecretKey = await new DescriptorSecretKey().create(Network.Testnet, mnemonic);
const externalDescriptor = await new Descriptor().newBip44(descriptorSecretKey, KeychainKind.External, Network.Testnet);
const internalDescriptor = await new Descriptor().newBip44(descriptorSecretKey, KeychainKind.Internal, Network.Testnet);

const config: BlockchainElectrumConfig = {
  url: 'ssl://electrum.blockstream.info:60002',
  sock5: null,
  retry: 5,
  timeout: 5,
  stopGap: 100,
  validateDomain: false,
};

const blockchain = await new Blockchain().create(config);
const dbConfig = await new DatabaseConfig().memory();

const wallet = await new Wallet().create(externalDescriptor, internalDescriptor, Network.Testnet, dbConfig);
await wallet.sync(blockchain);
```

### Create a `public` wallet descriptor

```ts
import { DescriptorSecretKey, Mnemonic, Descriptor } from 'bdk-rn';
import { WordCount, Network, KeychainKind } from 'bdk-rn/lib/lib/enums';

// ....

const mnemonic = await new Mnemonic().create(WordCount.WORDS12);
const descriptorSecretKey = await new DescriptorSecretKey().create(Network.Testnet, mnemonic);
const descriptorPublicKey = await descriptorSecretKey.asPublic();
const fingerprint = 'd1d04177';
const externalPublicDescriptor = await new Descriptor().newBip44Public(
  descriptorPublicKey,
  fingerprint,
  KeychainKind.External,
  Network.Testnet
);
```

### References:
- Setting up a local Esplora instance for testing:
https://bitcoin.stackexchange.com/questions/116937/how-do-i-setup-an-esplora-instance-for-local-testing/116938#116938
---

_Note: Caution this is an Alpha at this stage
Please consider reviewing, experimenting and contributing ⚡️_

Thanks for taking a look!
