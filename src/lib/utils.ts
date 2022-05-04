import AsyncStorage from '@react-native-async-storage/async-storage';
import is from 'is_js';
import { Response } from './interfaces';

/** Check if value is exists and not empty */
export const _exists = (value: any) => is.existy(value) && is.not.empty(value);

/** Store item to localStorage */
export const setItem = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value);
};

/** Get item from localStorage */
export const getItem = async (key: string): Promise<string | null> => {
  return (await AsyncStorage.getItem(key)) ?? null;
};

/** Remove item from localStorage */
export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

/** Return failed response */
export const failure = (data: any = ''): Response => ({
  error: true,
  data: data.code ? `Code: ${data.code} Message: ${data.message} ` : data,
});

/** Return success response */
export const success = (data: string | object | any = ''): Response => ({
  error: false,
  data,
});
