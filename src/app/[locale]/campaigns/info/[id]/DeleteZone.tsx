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
import ImageManager from "@/lib/ImageManager";
import { useRouter } from "@/navigation";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import OverlayLoading from "@/components/OverlayLoading";
import { useTranslations } from "next-intl";
import useConfirmDialog from "@/lib/hooks/useConfirmDialog";

const FormSchema = z.object({
  campaign_id: z.string().min(1, "formValidation.required"),
});

export default function CampaignDeleteZone({
  campaignId,
}: {
  campaignId: string;
}) {
  const t = useTranslations("CampaignDeleteZone");
  const supabase = createClient();
  const imageManager = new ImageManager(supabase);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const waitingConfirm = useConfirmDialog();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaign_id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const confirmed = await waitingConfirm({
      id: `delete-campaign-${data.campaign_id}`,
      title: t("deleteCampaign"),
      description: t("deleteCampaignDescription"),
    });

    if (!confirmed) return;

    if (data.campaign_id === campaignId) {
      try {
        setLoading(true);
        await imageManager.deleteImagesByCampaignId(data.campaign_id);
        await supabase.from("campaigns").delete().eq("id", data.campaign_id);
        toast({
          title: t("successTitle"),
          description: t("successDescription"),
        });
        router.push("/campaigns");
      } catch (error) {
        toast({
          title: t("errorTitle"),
          description: t("errorDescription"),
          variant: "destructive",
        });
      }
      setLoading(false);
    } else {
      form.setError("campaign_id", {
        type: "manual",
        message: t("idMismatchError"),
      });
    }
  }

  return (
    <Card className="w-full border border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{t("description")}</CardDescription>
        <div className="border border-input p-4 my-4">
          {t("campaignIdLabel")} {campaignId}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campaign_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("inputPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="destructive">
              {t("deleteButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
      {loading && <OverlayLoading />}
    </Card>
  );
}
