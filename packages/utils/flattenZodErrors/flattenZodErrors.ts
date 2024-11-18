/**
 * Iteratively flattens the error object using a breadth-first traversal to collect all error messages.
 *
 * @param {any} errorObj - The formatted error object returned by Zod.
 * @returns {string[]} - An array of all error messages collected from the `errorObj`, including nested errors.
 *
 * @example
 * const errors = {
 *   _errors: ["Top-level error"],
 *   name: { _errors: ["Name is required"] },
 *   address: {
 *     _errors: [],
 *     street: { _errors: ["Street is required"] },
 *     zip: { _errors: ["ZIP must be 5 characters"] },
 *   },
 * };
 * const result = flattenZodErrors(errors);
 * console.log(result);
 * // Output: [
 * //   "Top-level error",
 * //   "Name is required",
 * //   "Street is required",
 * //   "ZIP must be 5 characters"
 * // ]
 */
export default function flattenZodErrors(errorObj: any): string[] {
  const allErrors: string[] = []
  const queue = [errorObj]

  while (queue.length > 0) {
    // Left shift the first element in the queue
    const currentObject = queue.shift()

    // Check if the current object has a "_errors" property and add its value to the
    // "allErrors" array
    if (
      currentObject &&
      currentObject._errors &&
      Array.isArray(currentObject._errors)
    ) {
      allErrors.push(...currentObject._errors)
    }

    // Loop through the remaining objects in the current object
    // and add them to the queue so they can be processed
    for (const key in currentObject) {
      if (
        key !== '_errors' &&
        typeof currentObject[key] === 'object' &&
        !Array.isArray(currentObject[key])
      ) {
        queue.push(currentObject[key])
      }
    }
  }

  // Return all caught errors :)
  return allErrors
}
