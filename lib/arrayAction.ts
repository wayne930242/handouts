export const advancedArrayMove = <T extends Record<string, any>>(
  arr: readonly T[],
  oldIndex: number,
  newIndex: number,
  orderNumKey?: keyof T
): T[] => {
  const result = [...arr];
  const len = result.length;

  // Validate indices
  if (oldIndex !== -1 && (oldIndex < 0 || oldIndex >= len)) {
    throw new Error("Invalid oldIndex");
  }
  if (newIndex !== -1 && (newIndex < 0 || newIndex > len)) {
    throw new Error("Invalid newIndex");
  }

  // If no movement is required, return the original array
  if (oldIndex === newIndex) {
    return result;
  }

  const isRemoval = newIndex === -1;
  const isInsertion = oldIndex === -1;

  let elementToMove: T | undefined;
  if (!isInsertion) {
    elementToMove = result[oldIndex];
  }

  const startIndex = isInsertion ? newIndex : Math.min(oldIndex, newIndex);
  const endIndex = isRemoval
    ? oldIndex
    : isInsertion
    ? len
    : Math.max(oldIndex, newIndex);

  for (let i = startIndex; i <= endIndex; i++) {
    if (isRemoval) {
      if (i > oldIndex) {
        result[i - 1] = result[i];
        if (orderNumKey) {
          result[i - 1][orderNumKey] = (i - 1) as any;
        }
      }
    } else if (isInsertion) {
      if (i < newIndex) {
        if (orderNumKey) {
          result[i][orderNumKey] = i as any;
        }
      } else if (i === newIndex) {
        result[i] = {} as T;
        if (orderNumKey) {
          result[i][orderNumKey] = i as any;
        }
      } else {
        result[i] = result[i - 1];
        if (orderNumKey) {
          result[i][orderNumKey] = i as any;
        }
      }
    } else {
      // Moving existing element
      if (oldIndex < newIndex) {
        if (i > oldIndex && i <= newIndex) {
          result[i - 1] = result[i];
        } else if (i === newIndex) {
          result[i] = elementToMove!;
        }
      } else {
        // oldIndex > newIndex
        if (i === newIndex) {
          result[i] = elementToMove!;
        } else if (i > newIndex && i < oldIndex) {
          result[i + 1] = result[i];
        }
      }
      if (orderNumKey) {
        result[i][orderNumKey] = i as any;
      }
    }
  }

  if (isRemoval) {
    result.pop();
  }

  return result;
};
