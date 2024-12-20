/**
 * Parses a raw cookie string into an object mapping cookie names to their values.
 *
 * @param {string} rawCookies - The raw cookie string from the header of a request.
 * @returns {Record<string, string>} An object where each key is a cookie name and each value is the corresponding cookie value.
 *
 * @example
 *
 * const rawCookies = "fakeCookie=fakeValue; fakeCookie2=blah";
 *
 * const parsedCookies = parseCookies(rawCookies);
 * // Result: { fakeCookie: "fakeValue", fakeCookie2: "blah" }
 */
export default function parseCookies(
  rawCookies: string
): Record<string, string> {
  return Object.fromEntries(
    rawCookies
      .split('; ')
      .map((cookie) => cookie.split('=').map(decodeURIComponent))
  )
}
