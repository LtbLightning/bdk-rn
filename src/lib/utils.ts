import is from 'is_js';
import { Response } from './interfaces';

/** Check if value is exists and not empty */
export const _exists = (value: any) => is.existy(value) && is.not.empty(value);

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
