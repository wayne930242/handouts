import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { Eye, Pen } from "lucide-react";

export default function Toolbar() {
  const { editingCampaign, setEditingCampaign } = useAppStore();

  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1"></div>
      <div>
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant={editingCampaign ? "outline" : "secondary"}
          onClick={() => setEditingCampaign(!editingCampaign)}
        >
          {editingCampaign ? <Eye className="h-4 w-4" /> : <Pen className="h-4 w-4" />}
          {editingCampaign ? "關閉編輯" : "編輯"}
        </Button>
      </div>
    </div>
  );
}
