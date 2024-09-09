import DeleteZone from "@/components/form/DeleteZone";

export default function GameDeleteZone({ gameId }: { gameId: string }) {
  return (
    <DeleteZone
      id={gameId}
      type="game"
      translationNamespace="GameDeleteZone"
      tableName="games"
      redirectPath="/games"
    />
  );
}
