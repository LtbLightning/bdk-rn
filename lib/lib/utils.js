import is from 'is_js';
/** Check if value is exists and not empty */
export const _exists = (value) => is.existy(value) && is.not.empty(value);
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