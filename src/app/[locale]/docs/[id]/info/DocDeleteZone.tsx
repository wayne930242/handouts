"use client";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import ImageManager from "@/lib/ImageManager";
import useConfirmDialog from "@/lib/hooks/useConfirmDialog";
import { useClient } from "@/lib/supabase/client";
import { useRouter } from "@/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import OverlayLoading from "@/components/OverlayLoading";

const FormSchema = z.object({
  doc_id: z.string().min(1, "formValidation.required"),
});

export default function DocDeleteZone({ docId }: { docId: string }) {
  const t = useTranslations("DocDeleteZone");
  const supabase = useClient();
  const imageManager = new ImageManager();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { setConfirm } = useConfirmDialog(
    async (data: z.infer<typeof FormSchema>) => {
      if (data.doc_id === docId) {
        try {
          setLoading(true);
          await imageManager.deleteImagesByKeyAndId("docs", data.doc_id);
          await supabase.from("docs").delete().eq("id", data.doc_id);
          toast({
            title: t("successTitle"),
            description: t("successDescription"),
          });
          router.push("/docs");
        } catch (error) {
          toast({
            title: t("errorTitle"),
            description: t("errorDescription"),
            variant: "destructive",
          });
        }
        setLoading(false);
      } else {
        form.setError("doc_id", {
          type: "manual",
          message: t("idMismatchError"),
        });
      }
    }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      doc_id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setConfirm({
      id: `delete-doc-${data.doc_id}`,
      title: t("deleteDoc"),
      description: t("deleteDocDescription"),
      data,
    });
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
            {docId}
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doc_id"
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
