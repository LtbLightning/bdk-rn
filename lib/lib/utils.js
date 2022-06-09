import AsyncStorage from '@react-native-async-storage/async-storage';
import is from 'is_js';
/** Check if value is exists and not empty */
export const _exists = (value) => is.existy(value) && is.not.empty(value);
/** Store item to localStorage */
export const setItem = async (key, value) => {
    await AsyncStorage.setItem(key, value);
};
/** Get item from localStorage */
export const getItem = async (key) => {
    var _a;
    return (_a = (await AsyncStorage.getItem(key))) !== null && _a !== void 0 ? _a : null;
};
/** Remove item from localStorage */
export const removeItem = async (key) => {
    await AsyncStorage.removeItem(key);
};
/** Return failed response */
export const failure = (data = '') => ({
    error: true,
    data: data.code ? `Code: ${data.code} Message: ${data.message} ` : data,
});
/** Return success response */
export const success = (data = '') => ({
    error: false,
    data,
});
//# sourceMappingURL=utils.js.map