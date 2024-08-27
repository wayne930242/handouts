"use client";

import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";

export default function Toolbar() {
  const { setPassphraseDialog } = useAppStore();
  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1">
        <Button
          variant="outline"
          onClick={() => {
            setPassphraseDialog(true);
          }}
        >
          加入戰役
        </Button>
      </div>
      <div>
        <Link href="/campaigns/info/new">
          <Button>新戰役</Button>
        </Link>
      </div>
    </div>
  );
}
