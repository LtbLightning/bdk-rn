import { when } from 'jest-when';

import { Blockchain } from '../../src';

const mockBlockchain = new Blockchain();
const height = 2396450;
const hash = '0000000000004c01f2723acaa5e87467ebd2768cc5eadcf1ea0d0c4f1731efce';

describe('Blockchain', () => {
  it('verify getHeight', async () => {
    jest.spyOn(mockBlockchain, 'getHeight').mockResolvedValue(height);
    let res = await mockBlockchain.getHeight();
    await expect(res).toBe(height);
  });

  it('verify getBlockHash', async () => {
    when(mockBlockchain.getBlockHash).calledWith(height).mockResolvedValue(hash);
    let res = await mockBlockchain.getBlockHash(height);
    await expect(res).toBe(hash);
  });
});
