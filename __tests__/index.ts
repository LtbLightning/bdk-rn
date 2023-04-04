jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native'); // use original implementation, which comes with mocks out of the box

  // mock modules/components created by assigning to NativeModules
  RN.NativeModules.ReanimatedModule = {
    configureProps: jest.fn(),
    createNode: jest.fn(),
    connectNodes: jest.fn(),
    connectNodeToView: jest.fn(),
  };

  // mock modules created through UIManager
  RN.UIManager.getViewManagerConfig = (name) => {
    if (name === 'SomeNativeModule') {
      return { someMethod: jest.fn() };
    }
    return {};
  };
  return RN;
});

it.todo('write a test');
