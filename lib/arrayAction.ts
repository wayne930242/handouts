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

  return result;
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

  return result;
};

export const advancedMoveAcrossArrays = <T extends Record<string, any>>(
  sourceArr: readonly T[],
  targetArr: readonly T[],
  oldIndex: number,
  newIndex: number,
  orderNumKey?: keyof T,
  removeKeys?: (keyof T)[]
) => {
  const newSourceArr = [...sourceArr];
  const newTargetArr = [...targetArr];

  const elementToMove = newSourceArr[oldIndex];

  newSourceArr.splice(oldIndex, 1);
  newTargetArr.splice(newIndex, 0, elementToMove);

  // Update source array
  for (let i = oldIndex; i < sourceArr.length; i++) {
    if (!newSourceArr[i]) continue;
    if (orderNumKey) {
      newSourceArr[i][orderNumKey] = (i + 1) as any;
    }
    if (removeKeys) {
      for (const key of removeKeys) {
        delete newSourceArr[i][key];
      }
    }
  }

  // Update target array
  const targetStart = newIndex;
  const targetEnd = targetArr.length;
  for (let i = targetStart; i < targetEnd; i++) {
    if (!newTargetArr[i]) continue;
    if (orderNumKey) {
      newTargetArr[i][orderNumKey] = (i + 1) as any;
    }
    if (removeKeys) {
      for (const key of removeKeys) {
        delete newTargetArr[i][key];
      }
    }
  }

  return [newSourceArr, newTargetArr];
};
