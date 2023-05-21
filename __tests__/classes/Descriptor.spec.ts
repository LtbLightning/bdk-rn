import { Descriptor, DescriptorPublicKey } from '../../src';
import { KeychainKind, Network } from '../../src/lib/enums';
import { mockDescriptorSecret } from '../mockData';
import { mockBdkRnModule } from '../setup';

describe('Descriptor', () => {
  const mockDescriptorPublic = new DescriptorPublicKey();
  const descriptorString = 'descriptorString';
  let descriptor: Descriptor;
  const descriptorId = 'descriptorId';
  const fingerPrint = 'fingerPrint';

  mockBdkRnModule.createDescriptor.mockResolvedValue(descriptorId);

  beforeEach(async () => {
    descriptor = await new Descriptor().create(descriptorString, Network.Regtest);
  });
  it('creates a new instance of Descriptor', () => {
    expect(descriptor).toBeInstanceOf(Descriptor);
    expect(descriptor.id).toBe(descriptorId);
  });

  it('throws if wrong network has been passed', async () => {
    try {
      // @ts-ignore
      descriptorSecret = await new Descriptor().create(descriptorString, 'wrong');
    } catch (e) {
      expect(e).toBe('Invalid network passed. Allowed values are testnet,regtest,bitcoin,signet');
    }
  });

  it('returns string representation', async () => {
    mockBdkRnModule.descriptorAsString.mockResolvedValueOnce(descriptorString);
    let res = await descriptor.asString();
    expect(res).toBe(descriptorString);
  });
  it('returns string representation as private', async () => {
    mockBdkRnModule.descriptorAsStringPrivate.mockResolvedValueOnce(descriptorString);
    let res = await descriptor.asStringPrivate();
    expect(res).toBe(descriptorString);
  });
  it('creates new bip44 descriptor', async () => {
    const bip44DescriptorId = 'bip44DescriptorId';
    mockBdkRnModule.newBip44.mockResolvedValueOnce(bip44DescriptorId);
    await descriptor.newBip44(mockDescriptorSecret, KeychainKind.Internal, Network.Regtest);
    expect(mockBdkRnModule.newBip44).toHaveBeenCalledWith(
      mockDescriptorSecret.id,
      KeychainKind.Internal,
      Network.Regtest
    );
    expect(descriptor.id).toBe(bip44DescriptorId);
  });
  it('creates new bip44 descriptor public', async () => {
    const bip44DescriptorPublicId = 'bip44DescriptorPublicId';
    mockBdkRnModule.newBip44Public.mockResolvedValueOnce(bip44DescriptorPublicId);
    await descriptor.newBip44Public(mockDescriptorPublic, fingerPrint, KeychainKind.Internal, Network.Regtest);
    expect(mockBdkRnModule.newBip44Public).toHaveBeenCalledWith(
      mockDescriptorSecret.id,
      fingerPrint,
      KeychainKind.Internal,
      Network.Regtest
    );
    expect(descriptor.id).toBe(bip44DescriptorPublicId);
  });
  it('creates new bip49 descriptor', async () => {
    const bip49DescriptorId = 'bip49DescriptorId';
    mockBdkRnModule.newBip49.mockResolvedValueOnce(bip49DescriptorId);
    await descriptor.newBip49(mockDescriptorSecret, KeychainKind.Internal, Network.Regtest);
    expect(mockBdkRnModule.newBip49).toHaveBeenCalledWith(
      mockDescriptorSecret.id,
      KeychainKind.Internal,
      Network.Regtest
    );
    expect(descriptor.id).toBe(bip49DescriptorId);
  });
  it('creates new bip49 descriptor public', async () => {
    const bip49DescriptorPublicId = 'bip49DescriptorPublicId';
    mockBdkRnModule.newBip49Public.mockResolvedValueOnce(bip49DescriptorPublicId);
    await descriptor.newBip49Public(mockDescriptorPublic, fingerPrint, KeychainKind.Internal, Network.Regtest);
    expect(mockBdkRnModule.newBip49Public).toHaveBeenCalledWith(
      mockDescriptorPublic.id,
      fingerPrint,
      KeychainKind.Internal,
      Network.Regtest
    );
    expect(descriptor.id).toBe(bip49DescriptorPublicId);
  });
  it('creates new bip84 descriptor', async () => {
    const bip84DescriptorId = 'bip84DescriptorId';
    mockBdkRnModule.newBip84.mockResolvedValueOnce(bip84DescriptorId);
    await descriptor.newBip84(mockDescriptorSecret, KeychainKind.Internal, Network.Regtest);
    expect(mockBdkRnModule.newBip84).toHaveBeenCalledWith(
      mockDescriptorSecret.id,
      KeychainKind.Internal,
      Network.Regtest
    );
    expect(descriptor.id).toBe(bip84DescriptorId);
  });
  it('creates new bip84 descriptor public', async () => {
    const bip84DescriptorPublicId = 'bip84DescriptorPublicId';
    mockBdkRnModule.newBip84Public.mockResolvedValueOnce(bip84DescriptorPublicId);
    await descriptor.newBip84Public(mockDescriptorPublic, fingerPrint, KeychainKind.Internal, Network.Regtest);
    expect(mockBdkRnModule.newBip84Public).toHaveBeenCalledWith(
      mockDescriptorPublic.id,
      fingerPrint,
      KeychainKind.Internal,
      Network.Regtest
    );
    expect(descriptor.id).toBe(bip84DescriptorPublicId);
  });
});
