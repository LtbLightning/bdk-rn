import { when } from 'jest-when';

import { Script } from '../../src/classes/Bindings';
import { mockAddress, mockScript } from '../mockData';

describe('Address', () => {
  it('verify scriptPubKey()', async () => {
    when(mockAddress.scriptPubKey).mockResolvedValue(mockScript);
    let res = await mockAddress.scriptPubKey();
    expect(res).toBeInstanceOf(Script);
  });
});
