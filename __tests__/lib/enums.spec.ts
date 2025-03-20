import {
  Network,
  BlockChainNames,
  KeychainKind,
  WordCount,
  EntropyLength,
  AddressError,
  ChainPosition,
  CreateTxError,
} from '../../src/lib/enums';

describe('Enums', () => {
  it('should have correct Network values', () => {
    expect(Network.Testnet).toBe('testnet');
    expect(Network.Regtest).toBe('regtest');
    expect(Network.Bitcoin).toBe('bitcoin');
    expect(Network.Signet).toBe('signet');
  });

  it('should have correct BlockChainNames values', () => {
    expect(BlockChainNames.Electrum).toBe('Electrum');
    expect(BlockChainNames.Esplora).toBe('Esplora');
    expect(BlockChainNames.Rpc).toBe('Rpc');
  });

  it('should have correct KeychainKind values', () => {
    expect(KeychainKind.External).toBe('external');
    expect(KeychainKind.Internal).toBe('internal');
  });

  it('should have correct WordCount values', () => {
    expect(WordCount.WORDS12).toBe(12);
    expect(WordCount.WORDS24).toBe(24);
  });

  it('should have correct EntropyLength values', () => {
    expect(EntropyLength.Length16).toBe(16);
    expect(EntropyLength.Length32).toBe(32);
  });

  it('should have correct AddressError values', () => {
    expect(AddressError.Base58).toBe('Base58');
    expect(AddressError.Bech32).toBe('Bech32');
    expect(AddressError.OtherAddressErr).toBe('OtherAddressErr');
  });

  it('should have correct ChainPosition values', () => {
    expect(ChainPosition.Confirmed).toBe('Confirmed');
    expect(ChainPosition.Unconfirmed).toBe('Unconfirmed');
  });

  it('should have correct CreateTxError values', () => {
    expect(CreateTxError.Descriptor).toBe('Descriptor');
    expect(CreateTxError.InsufficientFunds).toBe('InsufficientFunds');
    expect(CreateTxError.MiniscriptPsbt).toBe('MiniscriptPsbt');
  });
});
