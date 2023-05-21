import { DerivationPath, DescriptorPublicKey, DescriptorSecretKey, Mnemonic } from '../../src';
import { Network } from '../../src/lib/enums';
import { mockDescriptorSecret, seedPhrase } from '../mockData';
import { mockBdkRnModule } from '../setup';

describe('DescriptorSecretKey', () => {
  let mnemonic: Mnemonic;
  const secretKeyId = 'secretKeyId';
  let descriptorSecret: DescriptorSecretKey;
  const derivationPathId = 'derivationPathId';
  let mockDerivationPath: DerivationPath;

  mockBdkRnModule.createDerivationPath.mockResolvedValue(derivationPathId);
  mockBdkRnModule.createDescriptorSecret.mockResolvedValue(secretKeyId);

  beforeEach(async () => {
    mnemonic = await new Mnemonic().create();
    mnemonic.fromString(seedPhrase);
    mnemonic.asString = () => seedPhrase;
    descriptorSecret = await new DescriptorSecretKey().create(Network.Regtest, mnemonic);
    mockDerivationPath = await new DerivationPath().create('path');
  });
  it('creates a new instance of DescriptorSecretKey', () => {
    expect(descriptorSecret).toBeInstanceOf(DescriptorSecretKey);
    expect(descriptorSecret.id).toBe(secretKeyId);
  });
  it('throws if wrong network has been passed', async () => {
    try {
      // @ts-ignore
      descriptorSecret = await new DescriptorSecretKey().create('wrong', mnemonic);
    } catch (e) {
      expect(e).toBe('Invalid network passed. Allowed values are testnet,regtest,bitcoin,signet');
    }
  });

  it('derives a new descriptor from derivation path', async () => {
    mockBdkRnModule.descriptorSecretDerive.mockResolvedValueOnce(mockDescriptorSecret.id);
    let res = await descriptorSecret.derive(mockDerivationPath);
    expect(mockBdkRnModule.descriptorSecretDerive).toHaveBeenCalledWith(secretKeyId, derivationPathId);
    expect(res).toBe(mockDescriptorSecret.id);
  });

  it('extends descriptorSecret from derivation path', async () => {
    mockBdkRnModule.descriptorSecretExtend.mockResolvedValueOnce(mockDescriptorSecret.id);
    let res = await descriptorSecret.extend(mockDerivationPath);
    expect(mockBdkRnModule.descriptorSecretExtend).toHaveBeenCalledWith(secretKeyId, derivationPathId);
    expect(res).toBe(mockDescriptorSecret.id);
  });

  it('returns string representation', async () => {
    const string =
      'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/*';
    mockBdkRnModule.descriptorSecretAsString.mockResolvedValueOnce(string);
    let res = await descriptorSecret.asString();
    expect(res).toBe(string);
  });
  it('derives descriptorPublicKey', async () => {
    const descriptorPublicId = 'descriptorPublicId';
    mockBdkRnModule.descriptorSecretAsPublic.mockResolvedValueOnce(descriptorPublicId);
    let res = await descriptorSecret.asPublic();
    expect(res).toBeInstanceOf(DescriptorPublicKey);
    expect(res.id).toBe(descriptorPublicId);
  });
  it('returns secret bytes', async () => {
    const secretBytes = [1, 2, 3];
    mockBdkRnModule.descriptorSecretAsSecretBytes.mockResolvedValueOnce(secretBytes);
    let res = await descriptorSecret.secretBytes();
    expect(mockBdkRnModule.descriptorSecretAsSecretBytes).toHaveBeenCalledWith(descriptorSecret.id);
    expect(res).toBe(secretBytes);
  });
});
