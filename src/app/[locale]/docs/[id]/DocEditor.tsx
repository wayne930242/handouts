"use client";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Doc } from "@/types/interfaces";
import ImageManager from "@/lib/ImageManager";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MyMDXEditor from "@/components/MyMDXEditor";
import OverlayLoading from "@/components/OverlayLoading";
import Image from "next/image";
import { X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  banner_url: z.string().optional(),
  content: z.string().optional(),
});

export default function DocEditor({ doc, callback }: Props) {
  const supabase = createClient();
  const t = useTranslations("DocEditor");

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const imageManager = new ImageManager();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: doc.title,
      description: doc.description ?? undefined,
      banner_url: doc.banner_url ?? undefined,
      content: doc.content ?? undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (file) {
      const imageUrl = await imageManager.uploadImage(file, "docs", doc.id);
      data.banner_url = imageUrl;
      setFile(null);
    }

    const { error: updateError } = await supabase
      .from("docs")
      .update({
        title: data.title,
        description: data.description,
        banner_url: data.banner_url,
        content: data.content,
      })
      .eq("id", doc.id)
      .select()
      .single();

    if (updateError) {
      toast({
        title: t("errorTitle"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("successTitle"),
        description: t("successDescription"),
      });
      callback?.();
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);

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

        <FormItem>
          <FormLabel>{t("bannerUrl")}</FormLabel>

          <Input
            ref={inputRef}
            placeholder={t("bannerUrlPlaceholder")}
            type="file"
            accept="image/*"
            onInput={(e) => {
              const file = (e.target as any).files?.[0];
              if (file) {
                setFile(file);
              } else {
                setFile(null);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }
            }}
          />
          <div className="w-full h-72 border border-border p-2 flex justify-center items-center rounded-sm relative">
            {(doc.banner_url || file) && (
              <Image
                className="object-cover"
                src={file ? URL.createObjectURL(file) : doc.banner_url!}
                alt="banner"
                loader={({ src }) => src}
                fill
                unoptimized
              />
            )}
            {(file || doc.banner_url) && (
              <Button
                className="absolute top-0 right-0"
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (file) {
                    setFile(null);
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  } else {
                    form.setValue("banner_url", undefined);
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("docContent")}</FormLabel>
              <FormControl>
                <MyMDXEditor
                  markdown={field.value ?? ""}
                  oldMarkdown={doc.content ?? ""}
                  onChange={(value) => field.onChange(value)}
                  imageUploadHandler={async (image: File) => {
                    setIsLoading(true);
                    return imageManager
                      .uploadImage(image, "docs", doc.id)
                      .then((url) => url)
                      .catch((e) => {
                        toast({
                          title: t("uploadFailed"),
                          description: t("uploadFailedDescription"),
                          variant: "destructive",
                        });
                        throw new Error("Failed to upload image");
                      })
                      .finally(() => setIsLoading(false));
                  }}
                />
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
            }}
          >
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {t("save")}
          </Button>
        </div>
      </form>
      {isLoading && <OverlayLoading />}
    </Form>
  );
}

interface Props {
  doc: Doc;
  callback?: () => any;
}
