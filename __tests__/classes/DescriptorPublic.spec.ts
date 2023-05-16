import { when } from 'jest-when';

import { DescriptorPublicKey } from '../../src';
import { mockDerivationPath, mockDescriptorPublic } from '../mockData';

describe('DescriptorPublic', () => {
  it('verify derive()', async () => {
    when(mockDescriptorPublic.derive).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorPublic);
    let res = await mockDescriptorPublic.derive(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorPublicKey);
  });

  it('verify extend()', async () => {
    when(mockDescriptorPublic.extend).calledWith(mockDerivationPath).mockResolvedValue(mockDescriptorPublic);
    let res = await mockDescriptorPublic.extend(mockDerivationPath);
    expect(res).toBeInstanceOf(DescriptorPublicKey);
  });

  it('verify asString()', async () => {
    when(mockDescriptorPublic.asString).mockResolvedValue(
      'tpubD6NzVbkrYhZ4X6hhuGPZoxCNUmTK2Wbh1X6sWFVNW5xVK1e7j4cxa7gdqPfWZ9AKeiaYYjhVi75t2gbubG3oPNpwpAoMtW9ki4Aj7itJMhm/*'
    );
    let res = await mockDescriptorPublic.asString();
    expect(res).toBe(
      'tpubD6NzVbkrYhZ4X6hhuGPZoxCNUmTK2Wbh1X6sWFVNW5xVK1e7j4cxa7gdqPfWZ9AKeiaYYjhVi75t2gbubG3oPNpwpAoMtW9ki4Aj7itJMhm/*'
    );
  });
});
