export const advancedArrayMove = <T extends Record<string, any>>(
  arr: readonly T[],
  oldIndex: number,
  newIndex: number,
  orderNumKey?: keyof T,
  removeKeys?: (keyof T)[]
): T[] => {
  const result = [...arr];

  // Store the element to be moved
  const elementToMove = result[oldIndex];

  result.splice(oldIndex, 1);
  result.splice(newIndex, 0, elementToMove);

  // Determine the range of affected elements
  const start = Math.min(oldIndex, newIndex);
  const end = Math.max(oldIndex, newIndex);

  // Update orderNum for affected elements
  if (orderNumKey || removeKeys) {
    for (let i = start; i < end; i++) {
      if (!result[i]) continue;
      if (orderNumKey) {
        result[i][orderNumKey] = (i + 1) as any;
      }
      if (removeKeys) {
        for (const key of removeKeys) {
          delete result[i][key];
        }
      }
    }
  }

  return [...result];
};

export const advancedAddElement = <T extends Record<string, any>>(
  arr: readonly T[],
  newRecord: T,
  orderNumKey?: keyof T,
  removeKeys?: (keyof T)[]
): T[] => {
  const result = [...arr];

  result.push(newRecord);

  if (orderNumKey || removeKeys) {
    for (let i = 0; i < result.length; i++) {
      if (orderNumKey) {
        result[i][orderNumKey] = (i + 1) as any;
      }
      if (removeKeys) {
        for (const key of removeKeys) {
          delete result[i][key];
        }
      }
    }
  }

  return [...result];
};

export const advancedRemoveElement = <T extends Record<string, any>>(
  arr: readonly T[],
  oldIndex: number,
  orderNumKey?: keyof T,
  removeKeys?: (keyof T)[]
): T[] => {
  const result = [...arr];

  result.splice(oldIndex, 1);

  if (orderNumKey || removeKeys) {
    for (let i = 0; i < result.length; i++) {
      if (orderNumKey) {
        result[i][orderNumKey] = (i + 1) as any;
      }
      if (removeKeys) {
        for (const key of removeKeys) {
          delete result[i][key];
        }
      }
    }
  }

  return [...result];
};
