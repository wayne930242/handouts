export const updateArray = <T extends { id: number | string }>(
  array: T[],
  record: T,
  oldRecord: T | undefined,
  eventType: "INSERT" | "UPDATE" | "DELETE"
): T[] => {
  if (!record) return array;
  const orderKey = (
    "order_num" in record
      ? "order_num"
      : "display_order" in record
      ? "display_order"
      : undefined
  ) as keyof T | undefined;

  const safeArray = array || [];

  let newArray: T[];
  switch (eventType) {
    case "INSERT":
      newArray = [...safeArray, record];
      break;

    case "UPDATE":
      newArray = safeArray.map((item) =>
        item.id === record.id ? { ...item, ...record } : item
      );
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

  if (orderKey && typeof record[orderKey] === "number") {
    return newArray.sort(
      (a, b) => (a[orderKey] as number) - (b[orderKey] as number)
    );
  }

  return newArray;
};
