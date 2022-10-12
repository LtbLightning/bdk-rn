import is from 'is_js';

/** Check if value is exists and not empty */
export const _exists = (value: any) => is.existy(value) && is.not.empty(value);
