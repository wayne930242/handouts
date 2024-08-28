export const updateArray = <T extends { id: number | string }>(
  array: T[],
  record: T,
  oldRecord: T | undefined,
  eventType: "INSERT" | "UPDATE" | "DELETE"
): T[] => {
  if (!record) return array;

  const safeArray = array || [];

  let newArray: T[];
  switch (eventType) {
    case "INSERT":
    case "UPDATE":
      // In fact, is is UPSERT
      const itemExists = safeArray.some((item) => item.id === record.id);
      if (itemExists) {
        newArray = safeArray.map((item) =>
          item.id === record.id ? { ...item, ...record } : item
        );
      } else {
        // If the item doesn't exist, treat it as an INSERT
        newArray = [...safeArray, record];
      }
      break;

    case "DELETE":
      if (!oldRecord) {
        throw new Error("oldRecord is required for DELETE event");
      }
      newArray = safeArray.filter((item) => item.id !== oldRecord.id);
      break;

    default:
      throw new Error(`Invalid event type: ${eventType}`);
  }

  const orderKey = (
    "order_num" in record
      ? "order_num"
      : "display_order" in record
      ? "display_order"
      : undefined
  ) as keyof T | undefined;
  if (orderKey && typeof record[orderKey] === "number") {
    return newArray.sort(
      (a, b) => (a[orderKey] as number) - (b[orderKey] as number)
    );
  }

  return newArray;
};
