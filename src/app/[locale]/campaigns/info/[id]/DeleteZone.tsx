"use client";

import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import ImageManager from "@/lib/supabase/ImageMamager";
import { useRouter } from "@/navigation";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import OverlayLoading from "@/components/OverlayLoading";

const FormSchema = z.object({
  campaign_id: z.string().min(1, "請輸入戰役 ID"),
});

export default function DeleteZone({ campaignId }: { campaignId: string }) {
  const supabase = createClient();
  const imageManager = new ImageManager(supabase);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaign_id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.campaign_id === campaignId) {
      try {
        setLoading(true);
        await imageManager.deleteImageByCampaignId(data.campaign_id);
        await supabase.from("campaigns").delete().eq("id", data.campaign_id);

        toast({
          title: "刪除成功",
          description: "你的戰役已經成功刪除。你現在有額度可以創建更多戰役。",
        });
        router.push("/campaigns");
      } catch (error) {
        toast({
          title: "刪除失敗",
          description: "刪除戰役時發生錯誤，請稍後再試。",
          variant: "destructive",
        });
      }
      setLoading(false);
    } else {
      form.setError("campaign_id", {
        type: "manual",
        message: "輸入的 ID 不匹配",
      });
    }
  }

  return (
    <Card className="w-full border border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">刪除戰役</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          刪除戰役後，所有的手邊資料、圖片等都將會被刪除，且無法復原。
        </CardDescription>
        <div className="border border-input p-4 my-4">
          戰役 ID：{campaignId}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campaign_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>輸入戰役 ID 以確認刪除</FormLabel>
                  <FormControl>
                    <Input placeholder="戰役 ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="destructive">
              刪除戰役
            </Button>
          </form>
        </Form>
      </CardContent>
      {loading && <OverlayLoading />}
    </Card>
  );
}
