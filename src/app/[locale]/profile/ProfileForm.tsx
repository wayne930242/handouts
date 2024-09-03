"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUploadFormItem from "@/components/ImageUploadFormItem";
import ImageManager from "@/lib/ImageManager";
import { Input } from "@/components/ui/input";
import { useClient } from "@/lib/supabase/client";
import useProfileStore from "@/lib/store/useProfileStore";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import OverlayLoading from "@/components/OverlayLoading";
import useSession from "@/lib/hooks/useSession";

const FormSchema = z.object({
  display_name: z.string().min(1),
  avatar_url: z.string().optional(),
});

export default function ProfileForm() {
  const supabase = useClient();
  const session = useSession();
  const userId = session?.user?.id;

  const imageManager = new ImageManager({
    maxSizeMB: 0.5,
    maxWidthOrHeight: 640,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const { profile, setProfile } = useProfileStore((state) => ({
    profile: state.profile,
    setProfile: state.setProfile,
  }));

  const t = useTranslations("ProfileForm");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      display_name: "",
      avatar_url: "",
    },
  });
  const { setValue } = form;

  useEffect(() => {
    if (profile) {
      setValue("display_name", profile.display_name ?? "");
      setValue("avatar_url", profile.avatar_url ?? "");
    }
  }, [profile, setValue]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!userId) return;
    setIsLoading(true);

    if (file) {
      const imageUrl = await imageManager.uploadImage(file, "profile", userId);
      data.avatar_url = imageUrl;
      setFile(null);
    }

    const { data: _data, error } = await supabase
      .from("profiles")
      .update({
        display_name: data.display_name,
        avatar_url: data.avatar_url,
      })
      .eq("id", userId);
    setIsLoading(false);

    if (error) {
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
    }

    if (_data) {
      setProfile(_data);
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
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("displayName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("displayNamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUploadFormItem
          initialUrl={profile?.avatar_url}
          file={file}
          setFile={setFile}
          onUrlClear={() => setValue("avatar_url", undefined)}
          label={t("avatarUrl")}
          placeholder={t("avatarUrlPlaceholder")}
          type="avatar"
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
