import { mockScript } from '../mockData';

import { Address } from '../../src';
import { Network } from '../../src/lib/enums';
import { Script } from '../../src/classes/Script';
import { mockBdkRnModule } from '../setup';

describe('Address', () => {
  const addressId = 'addressId';
  let address: Address;
  mockBdkRnModule.initAddress.mockResolvedValue(addressId);

  const addressQrUri = 'BITCOIN:TB1QCCMTNHCZMV3A6K4MTQ8TWM7LTJ3E32QSNTMAMV';
  const addressString = 'tb1qccmtnhczmv3a6k4mtq8twm7ltj3e32qsntmamv';

  beforeAll(async () => {
    address = await new Address().create('address', Network.Testnet);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates instance of Address', async () => {
    expect(address).toBeInstanceOf(Address);
    expect(address['id']).toBe(addressId);
  });

  it('verify scriptPubKey()', async () => {
    mockBdkRnModule.addressToScriptPubkeyHex.mockResolvedValueOnce(mockScript.id);
    let res = await address.scriptPubKey();
    expect(res).toBeInstanceOf(Script);
    expect(res['id']).toBe(mockScript.id);
    expect(mockBdkRnModule.addressToScriptPubkeyHex).toHaveBeenCalledWith(address['id']);
  });

  it('verify network()', async () => {
    let res = await address.network();
    expect(res).toBe(Network.Testnet);
    expect(mockBdkRnModule.addressNetwork).toHaveBeenCalledWith(address['id']);
  });

  it('verify toQrUri()', async () => {
    mockBdkRnModule.addressToQrUri.mockResolvedValueOnce(addressQrUri);
    let res = await address.toQrUri();
    expect(res).toBe(addressQrUri);
    expect(mockBdkRnModule.addressToQrUri).toHaveBeenCalledWith(address['id']);
  });

  it('verify asString()', async () => {
    mockBdkRnModule.addressAsString.mockResolvedValueOnce(addressString);
    let res = await address.asString();
    expect(res).toBe(addressString);
    expect(mockBdkRnModule.addressAsString).toHaveBeenCalledWith(address['id']);
  });

  it('verify addressIsValidForNetwork()', async () => {
    mockBdkRnModule.addressIsValidForNetwork.mockResolvedValueOnce(true);
    let res = await address.isValidForNetwork(Network.Testnet);
    expect(res).toBe(true);
    expect(mockBdkRnModule.addressIsValidForNetwork).toHaveBeenCalledWith(address.asString(), Network.Testnet);
  });
});
