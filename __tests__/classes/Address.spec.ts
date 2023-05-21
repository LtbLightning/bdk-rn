import { Address } from '../../src';
import { Script } from '../../src/classes/Bindings';
import { mockBdkRnModule } from '../setup';

describe('Address', () => {
  const mockScript = new Script('mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB');
  const addressId = 'addressId';
  let address: Address;
  mockBdkRnModule.initAddress.mockResolvedValue(addressId);

  beforeAll(async () => {
    address = await new Address().create('address');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('creates instance of Address', async () => {
    expect(address).toBeInstanceOf(Address);
    expect(address.id).toBe(addressId);
  });
  it('verify scriptPubKey()', async () => {
    mockBdkRnModule.addressToScriptPubkeyHex.mockResolvedValueOnce(mockScript.id);
    let res = await address.scriptPubKey();
    expect(res).toBeInstanceOf(Script);
    expect(res.id).toBe(mockScript.id);
    expect(mockBdkRnModule.addressToScriptPubkeyHex).toHaveBeenCalledWith(address.id);
  });
});
