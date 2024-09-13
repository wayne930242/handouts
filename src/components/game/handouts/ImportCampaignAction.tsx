"use client";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { useRouter } from "@/navigation";
import useSessionUser from "@/lib/hooks/useSession";
import { useClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import OverlayLoading from "@/components/layout/OverlayLoading";
import useGameStore from "@/lib/store/useGameStore";
import { getOwnedCampaigns } from "@/lib/supabase/query/campaignsQuery";
import useCampaignStore from "@/lib/store/useCampaignStore";

export default function ImportCampaignAction({ gameId }: { gameId: string }) {
  const t = useTranslations("GamePage");
  const supabase = useClient();
  const user = useSessionUser();
  const router = useRouter();

  const { setGameDocs } = useGameStore((state) => ({
    setGameDocs: state.setDocs,
  }));
  const { initCampaignData } = useCampaignStore((state) => ({
    initCampaignData: state.initCampaignData,
  }));

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const userId = user!.id;

  const { data: ownedCampaigns, isFetching } = useQuery(
    getOwnedCampaigns(supabase, userId)
  );
  const [isImporting, setIsImporting] = useState(false);

  const handleAddDocs = async () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("manageCampaign")}</Button>
      </DialogTrigger>{" "}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("manageCampaign")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("chooseCampaign")}</DialogDescription>
        <div className="flex flex-col gap-y-2 w-full">
          <Loading loading={isFetching} />
          {!isFetching && (
            <Command>
              <div className="relative">
                <CommandInput placeholder={t("searchPlaceholder")} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full absolute right-0 top-0"
                  onClick={() => {
                    router.push("/campaigns/new/info");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CommandList className="h-48 overflow-y-auto">
                <CommandEmpty>{t("noResults")}</CommandEmpty>
                <CommandGroup>
                  <RadioGroup defaultValue={undefined} className="w-full">
                    {ownedCampaigns?.map((c) => (
                      <CommandItem
                        key={`${c.id}`}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={c.id} id={`campaign-${c.id}`} />
                        <Label className="grow" htmlFor={`campaign-${c.id}`}>
                          {c.name}
                        </Label>
                      </CommandItem>
                    ))}
                  </RadioGroup>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{t("cancel")}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddDocs}>{t("confirm")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
      {isImporting && <OverlayLoading />}
    </Dialog>
  );
}
