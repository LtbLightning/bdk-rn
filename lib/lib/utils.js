import AsyncStorage from '@react-native-async-storage/async-storage';
import is from 'is_js';
export const _exists = (value) => is.existy(value) && is.not.empty(value);
export const setItem = async (key, value) => {
    await AsyncStorage.setItem(key, value);
};
export const getItem = async (key) => {
    var _a;
    return (_a = await AsyncStorage.getItem(key)) !== null && _a !== void 0 ? _a : null;
};
export const removeItem = async (key) => {
    await AsyncStorage.removeItem(key);
};
export const failure = (data = '') => ({ error: true, data: data.code ? `Code: ${data.code} Message: ${data.message} ` : data });
export const success = (data = '') => ({
    error: false,
    data,
});
//# sourceMappingURL=utils.js.map