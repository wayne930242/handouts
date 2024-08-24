export const advancedArrayMove = <T extends Record<string, any>>(
  arr: readonly T[],
  oldIndex: number,
  newIndex: number,
  orderNumKey?: keyof T,
  removeKeys?: (keyof T)[]
): T[] => {
  const result = [...arr];

  if (
    oldIndex < 0 ||
    oldIndex >= result.length ||
    newIndex < 0 ||
    newIndex >= result.length
  ) {
    throw new Error("Invalid index");
  }

  // Store the element to be moved
  const [elementToMove] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, elementToMove);

  // Determine the range of affected elements
  const start = Math.min(oldIndex, newIndex);
  const end = Math.max(oldIndex, newIndex);

  // Update orderNum for affected elements
  if (orderNumKey || removeKeys) {
    for (let i = start; i <= end; i++) {
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

export const advancedInsertElement = <T extends Record<string, any>>(
  arr: readonly T[],
  newIndex: number,
  element: T,
  orderNumKey?: keyof T,
  removeKeys?: (keyof T)[]
) => {
  const result = [...arr];

  if (newIndex < 0) {
    result.push(element);
    return result;
  }

  result.splice(newIndex, 0, element);

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
  removeKeys?: (keyof T)[],
  sourceUpdater?: (arr: T) => T,
  targetUpdater?: (arr: T) => T
) => {
  const newSourceArr = [...sourceArr];
  const newTargetArr = [...targetArr];

  const [elementToMove] = newSourceArr.splice(oldIndex, 1);
  newTargetArr.splice(newIndex, 0, elementToMove);

  // Update source array
  for (let i = oldIndex; i < newSourceArr.length; i++) {
    if (!newSourceArr[i]) continue;
    if (orderNumKey) {
      newSourceArr[i][orderNumKey] = (i + 1) as any;
    }
    if (removeKeys) {
      for (const key of removeKeys) {
        delete newSourceArr[i][key];
      }
    }
    if (sourceUpdater) {
      try {
        newSourceArr[i] = sourceUpdater(newSourceArr[i]);
      } catch (e) {
        console.error("Source array update error:", e);
      }
    }
  }

  // Update target array
  for (let i = newIndex; i < newTargetArr.length; i++) {
    if (!newTargetArr[i]) continue;
    if (orderNumKey) {
      newTargetArr[i][orderNumKey] = (i + 1) as any;
    }
    if (removeKeys) {
      for (const key of removeKeys) {
        delete newTargetArr[i][key];
      }
    }
    if (targetUpdater) {
      try {
        newTargetArr[i] = targetUpdater(newTargetArr[i]);
      } catch (e) {
        console.error("Target array update error:", e);
      }
    }
  }

  return [newSourceArr, newTargetArr];
};
