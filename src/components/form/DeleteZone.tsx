"use client";

import { z } from "zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";

import ImageManager from "@/lib/s3/ImageManager";
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
import OverlayLoading from "@/components/layout/OverlayLoading";
import ConfirmDialog from "../dialog/ConfirmDialog";

const FormSchema = z.object({
  id: z.string().min(1, "formValidation.required"),
});

export default function DeleteZone({
  id,
  type,
  translationNamespace,
  tableName,
  redirectPath,
}: {
  id: string;
  type: string;
  translationNamespace: string;
  tableName: "docs" | "campaigns" | "games";
  redirectPath: string;
}) {
  const t = useTranslations(translationNamespace);
  const supabase = useClient();
  const imageManager = new ImageManager();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [isPending, startTransition] = useTransition();
  const { mutateAsync: deleteItem } = useDeleteMutation(
    // @ts-ignore
    supabase.from(tableName),
    ["id"],
    "id"
  );

  const onConfirm = async (data: z.infer<typeof FormSchema>) => {
    if (data.id === id) {
      try {
        setLoading(true);
        await imageManager.deleteImagesByPrefix(
          `${tableName}/${data.id}/images`
        );
        await deleteItem({ id: data.id });
        toast({
          title: t("successTitle"),
          description: t("successDescription"),
        });
        startTransition(() => {
          router.push(redirectPath);
        });
      } catch (error) {
        toast({
          title: t("errorTitle"),
          description: t("errorDescription"),
          variant: "destructive",
        });
      }
      setLoading(false);
    } else {
      form.setError("id", {
        type: "manual",
        message: t("idMismatchError"),
      });
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
    },
  });

  const [data, setData] = useState<z.infer<typeof FormSchema>>();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setOpenConfirm(true);
    setData(data);
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
          <span className="border border-red-300 px-2 py-1 rounded-md whitespace-nowrap">
            {id}
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
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
      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        data={data!}
        onConfirm={onConfirm}
      />
      {(loading || isPending) && <OverlayLoading />}
    </Card>
  );
}
