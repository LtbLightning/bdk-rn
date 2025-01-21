import { mockScript } from '../mockData';
import { Address } from '../../src';
import { Network } from '../../src/lib/enums';
import { Script } from '../../src/classes/Script';
import { mockBdkRnModule } from '../setup';

describe('Address', () => {
  const addressId = 'addressId';
  let address: Address;
  const addressQrUri = 'BITCOIN:TB1QCCMTNHCZMV3A6K4MTQ8TWM7LTJ3E32QSNTMAMV';
  const addressString = 'tb1qccmtnhczmv3a6k4mtq8twm7ltj3e32qsntmamv';

  beforeAll(async () => {
    mockBdkRnModule.initAddress.mockResolvedValue(addressId);
    address = await new Address().create('address', Network.Testnet);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('creates instance of Address', async () => {
      expect(address).toBeInstanceOf(Address);
      expect(address['id']).toBe(addressId);
    });

    it('throws error when creating with invalid address', async () => {
      mockBdkRnModule.initAddress.mockRejectedValueOnce(new Error('Invalid address'));
      await expect(new Address().create('invalid', Network.Testnet)).rejects.toThrow('Invalid address');
    });
  });

  describe('scriptPubKey operations', () => {
    it('returns correct scriptPubKey', async () => {
      mockBdkRnModule.addressToScriptPubkeyHex.mockResolvedValueOnce(mockScript.id);
      const res = await address.scriptPubKey();
      expect(res).toBeInstanceOf(Script);
      expect(res['id']).toBe(mockScript.id);
      expect(mockBdkRnModule.addressToScriptPubkeyHex).toHaveBeenCalledWith(address['id']);
    });

    it('handles scriptPubKey error', async () => {
      mockBdkRnModule.addressToScriptPubkeyHex.mockRejectedValueOnce(new Error('Script error'));
      await expect(address.scriptPubKey()).rejects.toThrow('Script error');
    });
  });

  describe('network operations', () => {
    it('returns correct network', async () => {
      mockBdkRnModule.addressNetwork.mockResolvedValueOnce(Network.Testnet);
      const res = await address.network();
      expect(res).toBe(Network.Testnet);
      expect(mockBdkRnModule.addressNetwork).toHaveBeenCalledWith(address['id']);
    });

    it('handles network error', async () => {
      mockBdkRnModule.addressNetwork.mockRejectedValueOnce(new Error('Network error'));
      await expect(address.network()).rejects.toThrow('Network error');
    });
  });

  describe('QR and string operations', () => {
    it('returns correct QR URI', async () => {
      mockBdkRnModule.addressToQrUri.mockResolvedValueOnce(addressQrUri);
      const res = await address.toQrUri();
      expect(res).toBe(addressQrUri);
      expect(mockBdkRnModule.addressToQrUri).toHaveBeenCalledWith(address['id']);
    });

    it('returns correct string representation', async () => {
      mockBdkRnModule.addressAsString.mockResolvedValueOnce(addressString);
      const res = await address.asString();
      expect(res).toBe(addressString);
      expect(mockBdkRnModule.addressAsString).toHaveBeenCalledWith(address['id']);
    });
  });

  describe('network validation', () => {
    it('validates address for correct network', async () => {
      const mockAddressString = 'tb1qccmtnhczmv3a6k4mtq8twm7ltj3e32qsntmamv';
      mockBdkRnModule.addressAsString.mockResolvedValueOnce(mockAddressString);
      mockBdkRnModule.addressIsValidForNetwork.mockResolvedValueOnce(true);

      const res = await address.isValidForNetwork(Network.Testnet);

      expect(res).toBe(true);
      expect(mockBdkRnModule.addressIsValidForNetwork).toHaveBeenCalledWith(mockAddressString, Network.Testnet);
    });

    it('returns false for invalid network', async () => {
      const mockAddressString = 'tb1qccmtnhczmv3a6k4mtq8twm7ltj3e32qsntmamv';
      mockBdkRnModule.addressAsString.mockResolvedValueOnce(mockAddressString);
      mockBdkRnModule.addressIsValidForNetwork.mockResolvedValueOnce(false);

      const res = await address.isValidForNetwork(Network.Bitcoin);

      expect(res).toBe(false);
      expect(mockBdkRnModule.addressIsValidForNetwork).toHaveBeenCalledWith(mockAddressString, Network.Bitcoin);
    });

    it('handles validation errors', async () => {
      const mockAddressString = 'tb1qccmtnhczmv3a6k4mtq8twm7ltj3e32qsntmamv';
      mockBdkRnModule.addressAsString.mockResolvedValueOnce(mockAddressString);
      mockBdkRnModule.addressIsValidForNetwork.mockRejectedValueOnce(new Error('Validation error'));

      await expect(address.isValidForNetwork(Network.Testnet)).rejects.toThrow('Validation error');
    });
  });
});
