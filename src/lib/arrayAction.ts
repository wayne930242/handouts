export const advancedArrayMove = <T extends Record<string, any>>(
  arr: readonly T[],
  oldIndex: number,
  newIndex: number,
  orderNumKey?: keyof T,
  removeKeys?: (keyof T)[]
): T[] => {
  const result = arr.map((item) => ({ ...item }));

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
        result[i] = { ...result[i], [orderNumKey]: i + 1 };
      }
      if (removeKeys) {
        result[i] = Object.fromEntries(
          Object.entries(result[i]).filter(
            ([key]) => !removeKeys.includes(key as keyof T)
          )
        ) as T;
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
): T[] => {
  const result = arr.map((item) => ({ ...item }));

  if (newIndex < 0) {
    result.push(element);
  } else {
    result.splice(newIndex, 0, element);
  }

  if (orderNumKey || removeKeys) {
    for (let i = 0; i < result.length; i++) {
      if (!result[i]) continue;
      if (orderNumKey) {
        result[i] = { ...result[i], [orderNumKey]: i + 1 };
      }
      if (removeKeys) {
        result[i] = Object.fromEntries(
          Object.entries(result[i]).filter(
            ([key]) => !removeKeys.includes(key as keyof T)
          )
        ) as T;
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
  const result = arr.map((item) => ({ ...item }));

  result.splice(oldIndex, 1);

  if (orderNumKey || removeKeys) {
    for (let i = 0; i < result.length; i++) {
      if (!result[i]) continue;
      if (orderNumKey) {
        result[i] = { ...result[i], [orderNumKey]: i + 1 };
      }
      if (removeKeys) {
        result[i] = Object.fromEntries(
          Object.entries(result[i]).filter(
            ([key]) => !removeKeys.includes(key as keyof T)
          )
        ) as T;
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
  removeKeys?: (string)[],
  sourceUpdater?: (arr: T) => T,
  targetUpdater?: (arr: T) => T
): [T[], T[]] => {
  const newSourceArr = sourceArr.map((item) => ({ ...item }));
  const newTargetArr = targetArr.map((item) => ({ ...item }));

  const [elementToMove] = newSourceArr.splice(oldIndex, 1);
  const movedElement = { ...elementToMove };

  // Apply removeKeys to the moved element
  if (removeKeys) {
    removeKeys.forEach((key) => {
      delete movedElement[key];
    });
  }

  // Apply targetUpdater to the moved element
  if (targetUpdater) {
    Object.assign(movedElement, targetUpdater(movedElement));
  }

  newTargetArr.splice(newIndex, 0, movedElement);

  const updateArray = (
    arr: T[],
    startIndex: number,
    updater?: (arr: T) => T
  ) => {
    for (let i = startIndex; i < arr.length; i++) {
      if (!arr[i]) continue;
      let updatedItem = { ...arr[i] };

      if (orderNumKey) {
        updatedItem[orderNumKey] = (i + 1) as any;
      }

      if (removeKeys) {
        removeKeys.forEach((key) => {
          delete updatedItem[key];
        });
      }

      if (updater) {
        try {
          updatedItem = { ...updatedItem, ...updater(updatedItem) };
        } catch (e) {
          console.error("Array update error:", e);
        }
      }

      arr[i] = updatedItem;
    }
  };

  updateArray(newSourceArr, oldIndex, sourceUpdater);
  updateArray(newTargetArr, 0, targetUpdater); // Update all elements in the target array

  return [newSourceArr, newTargetArr];
};
