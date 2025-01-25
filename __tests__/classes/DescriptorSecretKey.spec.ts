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

  beforeAll(() => {
    Object.assign(mockBdkRnModule, {
      createDerivationPath: jest.fn().mockResolvedValue(derivationPathId),
      createDescriptorSecretKey: jest.fn().mockResolvedValue(secretKeyId),
      descriptorSecretKeyFromString: jest.fn().mockResolvedValue(secretKeyId),
      descriptorSecretKeyDerive: jest.fn().mockResolvedValue(mockDescriptorSecret.id),
      descriptorSecretKeyExtend: jest.fn().mockResolvedValue(mockDescriptorSecret.id),
      descriptorSecretKeyAsString: jest.fn().mockResolvedValue('string-value'),
      descriptorSecretKeyAsPublic: jest.fn().mockResolvedValue('public-key-id'),
      descriptorSecretKeySecretBytes: jest.fn().mockResolvedValue([1, 2, 3]),
      getDerivationPathAsString: jest.fn().mockResolvedValue('path'),
    });
  });

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
      await new DescriptorSecretKey().create('wrong', mnemonic);
      fail('Should have thrown an error');
    } catch (e) {
      expect(e).toBe('Invalid network passed. Allowed values are testnet,regtest,bitcoin,signet');
    }
  });

  it('creates from string representation', async () => {
    const secretKey = 'test-secret-key';
    const res = await descriptorSecret.fromString(secretKey);
    expect(mockBdkRnModule.descriptorSecretKeyFromString).toHaveBeenCalledWith(secretKey);
    expect(res).toBeInstanceOf(DescriptorSecretKey);
    expect(res.id).toBe(secretKeyId);
  });

  it('derives a new descriptor from derivation path', async () => {
    mockBdkRnModule.descriptorSecretKeyDerive.mockResolvedValueOnce(mockDescriptorSecret.id);
    const res = await descriptorSecret.derive(mockDerivationPath);
    expect(mockBdkRnModule.descriptorSecretKeyDerive).toHaveBeenCalledWith(secretKeyId, 'path');
    expect(res).toBeInstanceOf(DescriptorSecretKey);
    expect(res.id).toBe(mockDescriptorSecret.id);
  });

  it('extends descriptorSecret from derivation path', async () => {
    mockBdkRnModule.descriptorSecretKeyExtend.mockResolvedValueOnce(mockDescriptorSecret.id);
    const res = await descriptorSecret.extend(mockDerivationPath);
    expect(mockBdkRnModule.descriptorSecretKeyExtend).toHaveBeenCalledWith(secretKeyId, 'path');
    expect(res).toBeInstanceOf(DescriptorSecretKey);
    expect(res.id).toBe(mockDescriptorSecret.id);
  });

  it('returns string representation', async () => {
    const string =
      'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/*';
    mockBdkRnModule.descriptorSecretKeyAsString.mockResolvedValueOnce(string);
    const res = await descriptorSecret.asString();
    expect(mockBdkRnModule.descriptorSecretKeyAsString).toHaveBeenCalledWith(descriptorSecret.id);
    expect(res).toBe(string);
  });

  it('derives descriptorPublicKey', async () => {
    const descriptorPublicId = 'descriptorPublicId';
    mockBdkRnModule.descriptorSecretKeyAsPublic.mockResolvedValueOnce(descriptorPublicId);
    const res = await descriptorSecret.asPublic();
    expect(mockBdkRnModule.descriptorSecretKeyAsPublic).toHaveBeenCalledWith(descriptorSecret.id);
    expect(res).toBeInstanceOf(DescriptorPublicKey);
    expect(res.id).toBe(descriptorPublicId);
  });

  it('returns secret bytes', async () => {
    const secretBytes = [1, 2, 3];
    mockBdkRnModule.descriptorSecretKeySecretBytes.mockResolvedValueOnce(secretBytes);
    const res = await descriptorSecret.secretBytes();
    expect(mockBdkRnModule.descriptorSecretKeySecretBytes).toHaveBeenCalledWith(descriptorSecret.id);
    expect(res).toBe(secretBytes);
  });
});
