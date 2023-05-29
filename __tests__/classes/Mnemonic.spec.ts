import { Mnemonic } from '../../src';
import { WordCount } from '../../src/lib/enums';
import { seedPhrase } from '../mockData';
import { mockBdkRnModule } from '../setup';

describe('Mnemonic', () => {
  const randomSeephrase = 'daughter stock episode hour ankle scissors shrug vivid problem bar zero spy';
  let mnemonic: Mnemonic;
  mockBdkRnModule.generateSeedFromWordCount.mockResolvedValue(randomSeephrase);

  beforeEach(async () => {
    mnemonic = await new Mnemonic().create();
  });

  it('creates instance of mnemnic', async () => {
    mnemonic = await new Mnemonic().create();
    expect(mockBdkRnModule.generateSeedFromWordCount).toHaveBeenCalledWith(WordCount.WORDS12);
    expect(mnemonic).toBeInstanceOf(Mnemonic);
    expect(mnemonic.asString()).toBe(randomSeephrase);
  });

  it('creates instance of with different word count', async () => {
    mnemonic = await new Mnemonic().create(WordCount.WORDS24);
    expect(mockBdkRnModule.generateSeedFromWordCount).toHaveBeenCalledWith(WordCount.WORDS24);
    expect(mnemonic).toBeInstanceOf(Mnemonic);
    expect(mnemonic.asString()).toBe(randomSeephrase);
  });

  it('throws error for invalid word count', async () => {
    try {
      // @ts-ignore
      mnemonic = await new Mnemonic().create(99);
    } catch (e) {
      expect(e).toBe('Invalid word count passed');
    }
  });

  it('creates mnemonic from string', async () => {
    mockBdkRnModule.generateSeedFromString.mockResolvedValueOnce(seedPhrase);
    await mnemonic.fromString(seedPhrase);
    expect(mockBdkRnModule.generateSeedFromString).toHaveBeenCalledWith(seedPhrase);
    expect(mnemonic.asString()).toBe(seedPhrase);
  });
  it('creates mnemonic from entropy', async () => {
    const entropy = [1, 2, 3];
    mockBdkRnModule.generateSeedFromEntropy.mockResolvedValueOnce(seedPhrase);
    await mnemonic.fromEntropy(entropy);
    expect(mockBdkRnModule.generateSeedFromEntropy).toHaveBeenCalledWith(entropy);
    expect(mnemonic.asString()).toBe(seedPhrase);
  });
});
