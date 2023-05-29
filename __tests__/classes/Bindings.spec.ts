import { FeeRate } from '../../src/classes/Bindings';

describe('FeeRate', () => {
  const feeRate = new FeeRate(10);
  it('Should return a double when called', () => {
    expect(feeRate.asSatPerVb()).toBe(10);
  });
});
