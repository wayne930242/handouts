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
  getDocsByOwnerId,
  getMyDocs,
  getMyFavDocs,
} from "@/lib/supabase/query/docsQuery";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { DocInGame } from "@/types/interfaces";
import OverlayLoading from "@/components/layout/OverlayLoading";
import useGameStore from "@/lib/store/useGameStore";

const MyCheckBox = ({
  idSuffix,
  docId,
  selectedDocs,
  inInitDocs,
  setSelectedDocs,
}: {
  docId: string;
  idSuffix?: string;
  selectedDocs: string[];
  inInitDocs: (docId: string) => boolean;
  setSelectedDocs: (selectedDocs: string[]) => void;
}) => (
  <Checkbox
    id={`${docId}-${idSuffix}`}
    disabled={inInitDocs(docId)}
    checked={selectedDocs.includes(docId)}
    onCheckedChange={(checked) => {
      if (checked) {
        setSelectedDocs([...selectedDocs, docId]);
      } else {
        setSelectedDocs(selectedDocs.filter((id) => id !== docId));
      }
    }}
  />
);

export default function AddDocAction({
  gameId,
  docs,
}: {
  gameId: string;
  docs: DocInGame[];
}) {
  const t = useTranslations("GamePage");
  const supabase = useClient();
  const user = useSessionUser();
  const router = useRouter();

  const { setGameDocs } = useGameStore((state) => ({
    setGameDocs: state.setDocs,
  }));

  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const inInitDocs = useCallback(
    (docId: string) => {
      return docs?.some((d) => d?.id === docId) ?? false;
    },
    [docs]
  );

  useEffect(() => {
    if (docs) {
      setSelectedDocs(docs.map((d) => d.id));
    }
  }, [docs]);

  const userId = user!.id;

  const { data: ownedDocs, isFetching: isFetchingOwnedDocs } = useQuery(
    getDocsByOwnerId(supabase, userId)
  );
  const { data: favoriteDocs, isFetching: isFetchingFavoriteDocs } = useQuery(
    getMyFavDocs(supabase, userId)
  );
  const { data: myDocs, isFetching: isFetchingMyDocs } = useQuery(
    getMyDocs(supabase, userId)
  );
  const isFetching =
    isFetchingOwnedDocs || isFetchingFavoriteDocs || isFetchingMyDocs;
  const [isCreating, setIsCreating] = useState(false);
  const handleAddDocs = async () => {
    if (selectedDocs.length === 0) return;
    setIsCreating(true);
    const creatingData = selectedDocs.map((docId) => ({
      doc_id: docId,
      game_id: gameId,
    }));
    const result = await supabase
      .from("game_docs")
      .upsert(creatingData)
      .select(
        `
      doc_id,
      game_id,
      doc:docs (
        id,
        title,
        description,
        banner_url,
        content,
        owner:profiles!docs_owner_id_fkey (
          id,
          display_name,
          avatar_url
        )
      )
      `
      );

    const resultData = result?.data;

    if (resultData) {
      setGameDocs(resultData);
    }
    setIsCreating(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("addDocument")}</Button>
      </DialogTrigger>{" "}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addDocument")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("chooseDocument")}</DialogDescription>
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
                    router.push("/docs/new/info");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CommandList className="max-h-48 overflow-y-auto">
                <CommandEmpty>{t("noResults")}</CommandEmpty>
                <CommandGroup heading={t("myFavorites")}>
                  {favoriteDocs?.map((doc) => (
                    <CommandItem
                      key={`${doc.id}-favorite`}
                      className="flex items-center space-x-2"
                    >
                      <MyCheckBox
                        docId={doc.id}
                        idSuffix="favorite"
                        selectedDocs={selectedDocs}
                        inInitDocs={inInitDocs}
                        setSelectedDocs={setSelectedDocs}
                      />
                      <Label className="grow" htmlFor={`${doc.id}-favorite`}>
                        {doc.title}
                      </Label>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading={t("myOwned")}>
                  {ownedDocs?.map((doc) => (
                    <CommandItem
                      key={`${doc.id}-owned`}
                      className="flex items-center space-x-2"
                    >
                      <MyCheckBox
                        docId={doc.id}
                        idSuffix="owned"
                        selectedDocs={selectedDocs}
                        inInitDocs={inInitDocs}
                        setSelectedDocs={setSelectedDocs}
                      />
                      <Label className="grow" htmlFor={`${doc.id}-owned`}>
                        {doc.title}
                      </Label>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading={t("otherDocs")}>
                  {myDocs?.map((doc) => (
                    <CommandItem
                      key={`${doc.id}-other`}
                      className="flex items-center space-x-2"
                    >
                      <MyCheckBox
                        docId={doc.id}
                        idSuffix="other"
                        selectedDocs={selectedDocs}
                        inInitDocs={inInitDocs}
                        setSelectedDocs={setSelectedDocs}
                      />
                      <Label className="grow" htmlFor={`${doc.id}-other`}>
                        {doc.title}
                      </Label>
                    </CommandItem>
                  ))}
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
            <Button onClick={handleAddDocs}>{t("add")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
      {isCreating && <OverlayLoading />}
    </Dialog>
  );
}
