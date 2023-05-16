import { Address } from '../../src';
import { Script } from '../../src/classes/Bindings';
import { mockScript } from '../mockData';
import { mockBdkRnModule } from '../setup';

describe('Address', () => {
  it('verify scriptPubKey()', async () => {
    mockBdkRnModule.addressToScriptPubkeyHex.mockResolvedValue(mockScript);
    const address = await new Address().create('address');
    let res = await address.scriptPubKey();
    expect(res).toBeInstanceOf(Script);
  });
});
