import DeleteZone from "@/components/form/DeleteZone";

export default function DocDeleteZone({ docId }: { docId: string }) {
  return (
    <DeleteZone
      id={docId}
      type="doc"
      translationNamespace="DocDeleteZone"
      tableName="docs"
      redirectPath="/docs"
    />
  );
}
