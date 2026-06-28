import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

/** JSON body keys that must stay strings (OTP, pins, etc.). */
const BODY_STRING_KEYS = new Set([
  'code',
  'search',
  'otp',
  'pin',
  'token',
]);

@Injectable()
export class TransformNestedKeysPipe
  implements PipeTransform
{
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      return this.transformNestedKeys(value);
    }
    if (metadata.type === 'body') {
      return this.transformBody(value);
    }
    return value;
  }

  private transformNestedKeys(obj: any) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const result: Record<string, any> = {};

    for (const key in obj) {
      let value = obj[key];

      if (BODY_STRING_KEYS.has(key)) {
        result[key] = value;
        continue;
      }

      // Convert boolean strings to actual booleans
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
      // Convert numeric strings to numbers
      else if (
        !isNaN(Number(value)) &&
        value.trim() !== ''
      ) {
        value = Number(value);
      }

      const match = key.match(/^(.+?)\[(\d+|\w+)\]$/);
      if (match) {
        const parentKey = match[1];
        const childKey = match[2];
        const isArrayIndex = !isNaN(Number(childKey));

        if (!result[parentKey]) {
          result[parentKey] = isArrayIndex ? [] : {};
        }

        let value = obj[key];

        if (!isArrayIndex && BODY_STRING_KEYS.has(childKey)) {
          result[parentKey][childKey] = value;
          continue;
        }

        // Convert boolean strings to actual booleans
        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }
        // Convert numeric strings to numbers and not a search parameter
        else if (
          isArrayIndex &&
          typeof value === 'string' &&
          value.trim() !== '' &&
          !isNaN(Number(value)) &&
          parentKey !== 'search'
        ) {
          value = Number(value);
        }

        if (isArrayIndex) {
          result[parentKey][Number(childKey)] = value;
        } else {
          result[parentKey][childKey] = value;
        }
      } else {
        let currentValue = obj[key];
        // Convert boolean strings to actual booleans
        if (currentValue === 'true') {
          currentValue = true;
        } else if (currentValue === 'false') {
          currentValue = false;
        }
        // Convert numeric strings to numbers
        else if (
          typeof currentValue === 'string' &&
          currentValue.trim() !== '' &&
          !isNaN(Number(currentValue)) &&
          !BODY_STRING_KEYS.has(key)
        ) {
          currentValue = Number(currentValue);
        }
        result[key] = currentValue;
      }
    }
    return result;
  }

  private transformBody(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return this.transformValue(obj);
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformBody(item));
    }

    const result: Record<string, any> = {};
    const processedKeys = new Set<string>();

    // First pass: handle bracket notation (FormData nested objects/arrays)
    for (const key in obj) {
      const value = obj[key];
      const match = key.match(/^(.+?)\[(\d+|\w+)\]$/);

      if (match) {
        processedKeys.add(key);
        const parentKey = match[1];
        const childKey = match[2];
        const isArrayIndex = !isNaN(Number(childKey));

        if (!result[parentKey]) {
          result[parentKey] = isArrayIndex ? [] : {};
        }

        const transformedValue = this.transformValue(value, childKey);

        if (isArrayIndex) {
          result[parentKey][Number(childKey)] =
            transformedValue;
        } else {
          result[parentKey][childKey] = transformedValue;
        }
      }
    }

    // Second pass: handle regular keys (transform values and handle nested objects)
    for (const key in obj) {
      if (processedKeys.has(key)) {
        continue; // Skip already processed bracket notation keys
      }

      const value = obj[key];
      let transformedValue = this.transformValue(value, key);

      // If it's an object or array, transform it recursively
      if (
        typeof transformedValue === 'object' &&
        transformedValue !== null &&
        !Array.isArray(transformedValue)
      ) {
        transformedValue = this.transformBody(
          transformedValue,
        );
      } else if (Array.isArray(transformedValue)) {
        transformedValue = transformedValue.map((item) =>
          this.transformBody(item),
        );
      }

      result[key] = transformedValue;
    }

    return result;
  }

  private transformValue(value: any, fieldKey?: string): any {
    if (
      typeof value === 'string' &&
      fieldKey &&
      BODY_STRING_KEYS.has(fieldKey)
    ) {
      return value;
    }

    // If value is already a boolean, return as is
    if (typeof value === 'boolean') {
      return value;
    }

    // Convert boolean strings to actual booleans (from FormData)
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }

    // Coerce number back to string for known string fields (pipe may run after other transforms)
    if (
      fieldKey &&
      BODY_STRING_KEYS.has(fieldKey) &&
      typeof value === 'number' &&
      Number.isFinite(value)
    ) {
      return String(value);
    }

    // Convert numeric strings to numbers (but not for empty strings or non-numeric strings)
    if (
      typeof value === 'string' &&
      value.trim() !== '' &&
      !isNaN(Number(value))
    ) {
      const numValue = Number(value);
      // Only convert if it's a valid number (not NaN) and the string represents the same number
      if (
        !isNaN(numValue) &&
        value === numValue.toString()
      ) {
        return numValue;
      }
    }

    return value;
  }
}
