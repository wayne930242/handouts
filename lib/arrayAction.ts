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
    elementToMove = { ...result[oldIndex] };
  }

  if (isRemoval) {
    // Remove the element
    result.splice(oldIndex, 1);
    // Update orderNum and call callback for affected elements
    for (let i = oldIndex; i < result.length; i++) {
      if (orderNumKey) {
        result[i][orderNumKey] = (i + 1) as any;
      }
    }
  } else if (isInsertion) {
    // Insert new element
    result.splice(newIndex, 0, {} as T);
    // Update orderNum and call callback for affected elements
    for (let i = newIndex; i < result.length; i++) {
      if (orderNumKey) {
        result[i][orderNumKey] = (i + 1) as any;
      }
    }
  } else {
    // Move existing element
    result.splice(oldIndex, 1);
    result.splice(newIndex, 0, elementToMove!);

    // Determine the range of affected elements
    const start = Math.min(oldIndex, newIndex);
    const end = Math.max(oldIndex, newIndex);

    // Update orderNum and call callback for affected elements
    for (let i = start; i <= end; i++) {
      if (orderNumKey) {
        result[i][orderNumKey] = (i + 1) as any;
      }
    }
  }

  return result;
};
