## bdk-rn

A React Native version of the Bitcon Development Kit (https://bitcoindevkit.org/)
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

```js
import { DescriptorSecretKey, Mnemonic, Blockchain, Wallet, DatabaseConfig, Descriptor } from 'bdk-rn';
import { WordCount, Network } from 'bdk-rn/lib/lib/enums';

// ....

const mnemonic = await new Mnemonic().create(WordCount.WORDS12);
const descriptorSecretKey = await new DescriptorSecretKey().create(Network.Testnet, mnemonic);
const externalDescriptor = await new Descriptor().newBip44(descriptorSecretKey, KeyChainKind.External, Network.Testnet);
const internalDescriptor = await new Descriptor().newBip44(descriptorSecretKey, KeyChainKind.Internal, Network.Testnet);

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

```js
import { DescriptorSecretKey, Mnemonic, Descriptor } from 'bdk-rn';
import { WordCount, Network, KeyChainKind } from 'bdk-rn/lib/lib/enums';

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
