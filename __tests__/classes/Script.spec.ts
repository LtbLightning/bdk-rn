import { Script } from '../../src/classes/Bindings';
describe('Script', () => {
  const address = 'mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB';
  const script = new Script(address);

  it('verify create', async () => {
    let res = script;
    expect(res.id).toBe(address);
  });
});
