import { DerivationPath, DescriptorPublicKey } from '../../src';
import { mockBdkRnModule } from '../setup';

describe('DescriptorPublicKey', () => {
  const mockDescriptorPublic = new DescriptorPublicKey();
  const publicKeyId = 'publicKeyId';
  const publicKey = 'publicKey';
  let descriptorPublic: DescriptorPublicKey;
  const derivationPathId = 'derivationPathId';
  let mockDerivationPath: DerivationPath;

  mockBdkRnModule.createDerivationPath.mockResolvedValue(derivationPathId);

  beforeEach(async () => {
    descriptorPublic = new DescriptorPublicKey().create(publicKeyId);
    mockDerivationPath = await new DerivationPath().create('path');
  });
  it('creates a new instance of DescriptorPublicKey', () => {
    expect(descriptorPublic).toBeInstanceOf(DescriptorPublicKey);
    expect(descriptorPublic.id).toBe(publicKeyId);
  });

  it('creates a new descriptorPublicKey from string', async () => {
    const newId = 'newId';
    mockBdkRnModule.createDescriptorPublic.mockResolvedValueOnce(newId);
    const res = await descriptorPublic.fromString(publicKey);
    expect(mockBdkRnModule.createDescriptorPublic).toHaveBeenCalledWith(publicKey);
    expect(descriptorPublic.id).toBe(newId);
    expect(res.id).toBe(newId);
  });

  it('derives a new descriptor from derivation path', async () => {
    mockBdkRnModule.descriptorPublicDerive.mockResolvedValueOnce(mockDescriptorPublic.id);
    let res = await descriptorPublic.derive(mockDerivationPath);
    expect(mockBdkRnModule.descriptorPublicDerive).toHaveBeenCalledWith(publicKeyId, derivationPathId);
    expect(res).toBe(mockDescriptorPublic.id);
  });

  it('extends descriptorPublic from derivation path', async () => {
    mockBdkRnModule.descriptorPublicExtend.mockResolvedValueOnce(mockDescriptorPublic.id);
    let res = await descriptorPublic.extend(mockDerivationPath);
    expect(mockBdkRnModule.descriptorPublicExtend).toHaveBeenCalledWith(publicKeyId, derivationPathId);
    expect(res).toBe(mockDescriptorPublic.id);
  });

  it('returns string representation', async () => {
    const string =
      'tpubD6NzVbkrYhZ4X6hhuGPZoxCNUmTK2Wbh1X6sWFVNW5xVK1e7j4cxa7gdqPfWZ9AKeiaYYjhVi75t2gbubG3oPNpwpAoMtW9ki4Aj7itJMhm/*';
    mockBdkRnModule.descriptorPublicAsString.mockResolvedValueOnce(string);
    let res = await descriptorPublic.asString();
    expect(res).toBe(string);
  });
});
