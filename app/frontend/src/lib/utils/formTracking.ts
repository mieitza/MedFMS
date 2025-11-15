/**
 * Form change tracking utility
 *
 * Tracks which fields have been modified in a form to enable granular updates.
 * This prevents overwriting unchanged fields when updating entities.
 *
 * Usage:
 * ```typescript
 * const tracker = createFormTracker(originalData);
 *
 * // Update form field
 * formData.fieldName = newValue;
 * tracker.markChanged('fieldName');
 *
 * // Get only changed fields for PATCH request
 * const changedFields = tracker.getChangedFields(formData);
 * ```
 */

export interface FormTracker<T = any> {
  /**
   * Mark a field as changed
   */
  markChanged(fieldName: keyof T): void;

  /**
   * Mark multiple fields as changed
   */
  markManyChanged(fieldNames: (keyof T)[]): void;

  /**
   * Check if a field has been changed
   */
  hasChanged(fieldName: keyof T): boolean;

  /**
   * Get all changed field names
   */
  getChangedFieldNames(): (keyof T)[];

  /**
   * Get only the changed fields from the form data
   * Returns an object containing only fields that were modified
   */
  getChangedFields(currentData: T): Partial<T>;

  /**
   * Reset all changes
   */
  reset(): void;

  /**
   * Set new original data (e.g., after successful save)
   */
  setOriginalData(data: T): void;

  /**
   * Auto-detect changes by comparing current data with original
   * Returns object with only changed fields
   */
  detectChanges(currentData: T): Partial<T>;
}

/**
 * Create a form change tracker
 * @param originalData The original data to compare against
 */
export function createFormTracker<T extends Record<string, any>>(
  originalData: T
): FormTracker<T> {
  let changedFields = new Set<keyof T>();
  let original = { ...originalData };

  return {
    markChanged(fieldName: keyof T): void {
      changedFields.add(fieldName);
    },

    markManyChanged(fieldNames: (keyof T)[]): void {
      fieldNames.forEach(fieldName => changedFields.add(fieldName));
    },

    hasChanged(fieldName: keyof T): boolean {
      return changedFields.has(fieldName);
    },

    getChangedFieldNames(): (keyof T)[] {
      return Array.from(changedFields);
    },

    getChangedFields(currentData: T): Partial<T> {
      const changes: Partial<T> = {};

      changedFields.forEach(fieldName => {
        if (fieldName in currentData) {
          changes[fieldName] = currentData[fieldName];
        }
      });

      return changes;
    },

    reset(): void {
      changedFields.clear();
    },

    setOriginalData(data: T): void {
      original = { ...data };
      changedFields.clear();
    },

    detectChanges(currentData: T): Partial<T> {
      const changes: Partial<T> = {};

      for (const key in currentData) {
        if (currentData.hasOwnProperty(key)) {
          const currentValue = currentData[key];
          const originalValue = original[key];

          // Deep equality check for different types
          if (!isEqual(currentValue, originalValue)) {
            changes[key] = currentValue;
          }
        }
      }

      return changes;
    }
  };
}

/**
 * Simple deep equality check
 * Handles primitives, arrays, and objects
 */
function isEqual(a: any, b: any): boolean {
  // Handle null and undefined
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  // Handle primitives
  if (typeof a !== 'object') return a === b;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => isEqual(a[key], b[key]));
}

/**
 * Svelte store-based form tracker
 * For use with Svelte's reactive stores
 */
export function createReactiveFormTracker<T extends Record<string, any>>(
  originalData: T
) {
  const tracker = createFormTracker(originalData);
  const changedFieldsStore = {
    subscribe(callback: (fields: (keyof T)[]) => void) {
      // Simple store implementation
      let currentFields = tracker.getChangedFieldNames();
      callback(currentFields);

      return () => {};
    }
  };

  return {
    ...tracker,
    changedFields: changedFieldsStore
  };
}
