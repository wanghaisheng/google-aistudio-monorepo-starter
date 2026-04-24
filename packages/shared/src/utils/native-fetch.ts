/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Export the native fetch to avoid problematic polyfills in the browser
const nativeFetch = typeof window !== 'undefined' ? window.fetch.bind(window) : fetch;
export default nativeFetch;
export const Request = typeof window !== 'undefined' ? window.Request : (global as any).Request;
export const Response = typeof window !== 'undefined' ? window.Response : (global as any).Response;
export const Headers = typeof window !== 'undefined' ? window.Headers : (global as any).Headers;
export { nativeFetch as fetch };
