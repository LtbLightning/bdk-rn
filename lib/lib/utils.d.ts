import { Response } from './interfaces';
/** Check if value is exists and not empty */
export declare const _exists: (value: any) => any;
/** Store item to localStorage */
export declare const setItem: (key: string, value: string) => Promise<void>;
/** Get item from localStorage */
export declare const getItem: (key: string) => Promise<string | null>;
/** Remove item from localStorage */
export declare const removeItem: (key: string) => Promise<void>;
/** Return failed response */
export declare const failure: (data?: any) => Response;
/** Return success response */
export declare const success: (data?: string | object | any) => Response;
