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
  rule_id: z.string().min(1, "formValidation.required"),
});

export default function CampaignDeleteZone({ ruleId }: { ruleId: string }) {
  const t = useTranslations("CampaignDeleteZone");
  const supabase = createClient();
  const imageManager = new ImageManager();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { setConfirm } = useConfirmDialog(
    async (data: z.infer<typeof FormSchema>) => {
      if (data.rule_id === ruleId) {
        try {
          setLoading(true);
          await imageManager.deleteImagesByCampaignId("rules", data.rule_id);
          await supabase.from("rules").delete().eq("id", data.rule_id);
          toast({
            title: t("successTitle"),
            description: t("successDescription"),
          });
          router.push("/rules");
        } catch (error) {
          toast({
            title: t("errorTitle"),
            description: t("errorDescription"),
            variant: "destructive",
          });
        }
        setLoading(false);
      } else {
        form.setError("rule_id", {
          type: "manual",
          message: t("idMismatchError"),
        });
      }
    }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rule_id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setConfirm(
      {
        id: `delete-campaign-${data.rule_id}`,
        title: t("deleteCampaign"),
        description: t("deleteCampaignDescription"),
      },
      data
    );
  }

  return (
    <Card className="w-full border border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{t("description")}</CardDescription>
        <div className="border border-input p-4 my-4">
          {t("idLabel")}{" "}
          <span className="border border-red-300 px-2 py-1 rounded-md">
            {ruleId}
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rule_id"
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
