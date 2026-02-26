// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
/**
 * Wraps a Promise in a try-catch block and returns a Result object.
 *
 * @template T - The type of the successful result
 * @template E - The type of the error, defaults to Error
 * @param promise - The Promise to be executed
 * @returns A Promise that resolves to a Result object containing either the data or the error
 *
 * @example
 * ```typescript
 * const result = await tryCatch(somePromise);
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.data);
 * }
 * ```
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
