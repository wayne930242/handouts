"use client";
import { GameInList } from "@/types/interfaces";
import ItemCard from "../card/ItemCard";

export default function GameCard({ game }: { game: GameInList }) {
  return (
    <ItemCard
      tableName="games"
      ownerInfo={{
        id: game.gm_id,
        display_name: game.gm?.display_name,
        avatar_url: game.gm?.avatar_url,
      }}
      bannerUrl={game.banner_url}
      title={game.title}
      description={game.description}
      id={game.id}
    />
  );
}
