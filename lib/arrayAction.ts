export const advancedArrayMove = <T extends Record<string, any>>(
  arr: readonly T[],
  oldIndex: number,
  newIndex: number,
  orderNumKey?: keyof T
): T[] => {
  const result = [...arr];

  // Store the element to be moved
  const elementToMove = result[oldIndex];

  // Remove the element from its old position
  result.splice(oldIndex, 1);

  // Insert the element at its new position
  result.splice(newIndex, 0, elementToMove);

  // Determine the range of affected elements
  const start = Math.min(oldIndex, newIndex);
  const end = Math.max(oldIndex, newIndex);

  // Update orderNum for affected elements
  if (orderNumKey) {
    for (let i = start; i <= end; i++) {
      result[i][orderNumKey] = (i + 1) as any;
    }
  }

  return result;
};
