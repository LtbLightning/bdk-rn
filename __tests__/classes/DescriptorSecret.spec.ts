import { when } from 'jest-when';

import { DescriptorPublicKey, DescriptorSecretKey } from '../../src';
import { mockDerivationPath, mockDescriptorPublic, mockDescriptorSecret } from '../mockData';

describe('DescriptorSecret', () => {
  it('verify derive()', async () => {
    when(mockDescriptorSecret.derive).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorSecret);
    let res = await mockDescriptorSecret.derive(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorSecretKey);
  });

  it('verify extend()', async () => {
    when(mockDescriptorSecret.extend).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorSecret);
    let res = await mockDescriptorSecret.extend(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorSecretKey);
  });

  it('verify asPublic()', async () => {
    when(mockDescriptorSecret.asPublic).mockResolvedValue(mockDescriptorPublic);
    let res = await mockDescriptorSecret.asPublic();
    expect(res).toBeInstanceOf(DescriptorPublicKey);
  });

  it('verify asString()', async () => {
    when(mockDescriptorSecret.asString).mockResolvedValue(
      'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/*'
    );
    let res = await mockDescriptorSecret.asString();
    expect(res).toBe(
      'tprv8ZgxMBicQKsPd3G66kPkZEuJZgUK9QXJRYCwnCtYLJjEZmw8xFjCxGoyx533AL83XFcSQeuVmVeJbZai5RTBxDp71Abd2FPSyQumRL79BKw/*'
    );
  });
});
