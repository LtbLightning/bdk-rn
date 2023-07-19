import { Script } from '../../src/classes/Script';
import { mockBdkRnModule } from '../setup';
import { mockScriptBytes } from '../mockData';

describe('Script', () => {
  const address = 'mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB';
  const script = new Script(address);

  it('verify create', async () => {
    let res = script;
    expect(res.id).toBe(address);
  });

  it('verify toBytes', async () => {
    mockBdkRnModule.toBytes.mockResolvedValueOnce(mockScriptBytes);
    let res = await script.toBytes();
    expect(res).toBe(mockScriptBytes);
    expect(mockBdkRnModule.toBytes).toHaveBeenCalledWith(script.id);
  });
});
