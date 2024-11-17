// Typescript can be frustrating sometimes

/**
 * A type guard function to validate if a user object has certain properties.
 *
 * @param {any} user - The user object.
 * @returns {user is { id: string; email: string }} - Returns true if the user object has a `string` type `id` and `email` properties, otherwise false.
 *
 * @example
 * const user = { id: '123', email: 'test@example.com' };
 * if (isValidUser(user)) {
 *   // TypeScript knows `user` is { id: string; email: string }
 *   console.log(user.id, user.email);
 * }
 */
export default function isValidUser(
  user: any
): user is { id: string; email: string } {
  return user && typeof user.id === 'string' && typeof user.email === 'string'
}
