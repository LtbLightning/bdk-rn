import { Response } from './interfaces';
/** Check if value is exists and not empty */
export declare const _exists: (value: any) => any;
/** Return failed response */
export declare const failure: (data?: any) => Response;
/** Return success response */
export declare const success: (data?: string | object | any) => Response;
