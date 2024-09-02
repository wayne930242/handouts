"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getDocInfo } from "@/lib/supabase/query/docsQuery";
import { useEffect, useState } from "react";
import OverlayLoading from "@/components/OverlayLoading";

const FormSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  passphrase: z.string().max(255).optional(),
  is_public: z.boolean(),
});

export default function DocForm({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const t = useTranslations("DocForm");
  const supabase = createClient();
  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();
  const { data: docInfo, isFetching } = useQuery(getDocInfo(supabase, id), {
    enabled: id !== "new",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      passphrase: "",
      is_public: false,
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (!docInfo) return;
    reset({
      title: docInfo?.title ?? "",
      description: docInfo?.description ?? "",
      passphrase: docInfo?.passphrase ?? "",
      is_public: docInfo?.is_public ?? false,
    });
  }, [docInfo, reset]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let errorMessage: string | undefined;
    switch (id) {
      case "new":
        const { error: createError } = await supabase.from("docs").insert([
          {
            title: data.title,
            owner_id: userId,
            description: data.description,
            passphrase: data.passphrase,
            is_public: data.is_public,
          },
        ]);

        if (createError) {
          errorMessage = createError.message;
        }
        break;
      default:
        if (!id) {
          errorMessage = "Campaign ID is required";
          break;
        }
        const { error: updateError } = await supabase
          .from("docs")
          .update({
            id,
            owner_id: userId,
            title: data.title,
            is_public: data.is_public,
            description: data.description,
            passphrase: data.passphrase,
          })
          .eq("id", id);

        if (updateError) {
          errorMessage = updateError.message;
        }
    }

    if (errorMessage) {
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      router.push("/docs");
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full grid gap-y-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("docName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("docNamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("docDescription")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("docDescriptionPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passphrase"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="w-full">{t("passphrase")}</FormLabel>
              <FormControl>
                <Input placeholder={t("passphrasePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              form.reset();
              router.push("/docs");
            }}
          >
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {id === "new" ? t("create") : t("save")}
          </Button>
        </div>
      </form>
      {(isFetching || isLoading) && <OverlayLoading />}
    </Form>
  );
}
