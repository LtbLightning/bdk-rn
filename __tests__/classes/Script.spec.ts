import { Script } from '../../src/classes/Bindings';
import { mockScript } from '../mockData';

describe('Script', () => {
  it('verify create', async () => {
    let res = mockScript;
    expect(res).toBeInstanceOf(Script);
  });
});
