import { TransactionDetails } from '../../src/classes/Bindings'
import { createTxDetailsObject } from '../../src/lib/utils'

describe('createTxDetailsObject', ()=> {
  const item = {
    txid: 'txid',
    received: 1,
    sent: 2,
    fee: 500,
    confirmationTime: {
      height: 615,
      timestamp: 1684262862999
    }
  }
  it('should create a tx details obejct', ()=> {
    const result = createTxDetailsObject(item)
    expect(result).toBeInstanceOf(TransactionDetails)
    expect(result).toEqual(item)
  })
})