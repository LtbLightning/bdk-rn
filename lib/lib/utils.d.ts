import { Response } from './interfaces';
export declare const _exists: (value: any) => any;
export declare const setItem: (key: string, value: string) => Promise<void>;
export declare const getItem: (key: string) => Promise<string | null>;
export declare const removeItem: (key: string) => Promise<void>;
export declare const failure: (data?: any) => Response;
export declare const success: (data?: string | object | any) => Response;
