type NullToUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
  ? NullToUndefined<U>[]
  : T extends object
  ? { [K in keyof T]: NullToUndefined<T[K]> }
  : T;

export function cleanObject<T>(obj: T): NullToUndefined<T> {
  if (obj === null) {
    return undefined as NullToUndefined<T>;
  }

  if (typeof obj !== 'object') {
    return obj as NullToUndefined<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanObject) as NullToUndefined<T>;
  }

  const cleanedObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      cleanedObj[key] = undefined;
    } else if (typeof value === 'object') {
      cleanedObj[key] = cleanObject(value);
    } else {
      cleanedObj[key] = value;
    }
  }

  return cleanedObj as NullToUndefined<T>;
}