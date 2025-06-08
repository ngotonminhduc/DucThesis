/**
 * Transforms an array of objects into an object with keys derived from a unique field
 * and values being either the original object or a transformed version.
 *
 * @param array - Array of objects to transform
 * @param keyField - Field name to use as key in the result object
 * @param valueTransformer - Optional transformation function to process values
 * @returns Result object with key-value structure
 */
export function arrayToObject<
  T extends Record<string, any>,
  K extends keyof T,
  R = T
>(
  array: T[],
  keyField: K,
  valueTransformer?: (item: T) => R
): Record<string, R> {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array");
  }

  if (!keyField || typeof keyField !== "string") {
    throw new Error("keyField must be a non-empty string");
  }

  return array.reduce<Record<string, R>>((result, item) => {
    if (item == null || typeof item !== "object") {
      return result; // Skip elements that are not objects
    }

    const key = item[keyField];

    // Check if key exists and can be used as an object key
    if (
      key == null ||
      (typeof key !== "string" &&
        typeof key !== "number" &&
        typeof key !== "boolean")
    ) {
      return result; // Skip items without a valid keyField
    }

    // Apply transformation function if provided, otherwise use original object
    const value = valueTransformer
      ? valueTransformer(item)
      : (item as unknown as R);

    result[String(key)] = value;
    return result;
  }, {});
}