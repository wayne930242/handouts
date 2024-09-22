"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ChevronsUpDown } from "lucide-react";
import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import useCampaignStore from "@/lib/store/useCampaignStore";
import { Handout } from "@/types/interfaces";
import { useTranslations } from "next-intl";
import { useClient } from "@/lib/supabase/client";
import usePreventLeave from "@/lib/hooks/usePreventLeave";
import ImageManager, { ImageKeyPrefix } from "@/lib/s3/ImageManager";
import ConfirmDialog from "../dialog/ConfirmDialog";

const ImageEditor = dynamic(
  () => import("./HandoutContentEditor/ImageEditor"),
  {
    ssr: false,
  }
);
const LinkEditor = dynamic(() => import("./HandoutContentEditor/LinkEditor"), {
  ssr: false,
});
const TextEditor = dynamic(() => import("./HandoutContentEditor/TextEditor"), {
  ssr: false,
});
const YoutubeEditor = dynamic(
  () => import("./HandoutContentEditor/YoutubeEditor"),
  {
    ssr: false,
  }
);

const formSchema = z.object({
  title: z.string().max(255),
  type: z.string().optional(),
  content: z.string().optional(),
  is_public: z.boolean(),
  note: z.string().optional(),
});

export type ContentFieldProps = ControllerRenderProps<
  z.infer<typeof formSchema>,
  "content"
>;

export default function HandoutCard({ handout }: Props) {
  const supabase = useClient();

  const { setCampaignData, editingStage, editingId } = useCampaignStore(
    (state) => ({
      setCampaignData: state.setCampaignData,
      editingStage: state.editingStage,
      editingId: state.editingId,
    })
  );

  const t = useTranslations("HandoutCard");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: handout.title,
      type: handout.type ?? "text",
      content: handout.content ?? "",
      is_public: handout.is_public ?? false,
      note: handout.note ?? "",
    },
  });

  const {
    formState: { isDirty },
  } = form;
  usePreventLeave(isDirty, t("leaveAlert"));

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (editingId) {
      setCampaignData(
        {
          id: handout.id,
          section_id: handout.section_id,
          campaign_id: handout.campaign_id,
          screen_id: handout.screen_id,
          title: data.title,
          type: data.type ?? null,
          content: data.content ?? null,
          is_public: data.is_public,
          note: data.note ?? null,
          order_num: handout.order_num,
          owner_id: handout.owner_id,
        },
        {
          id: handout.id,
          section_id: handout.section_id,
          screen_id: handout.screen_id,
          campaign_id: handout.campaign_id,
          title: handout.title,
          type: handout.type,
          content: handout.content,
          is_public: handout.is_public ?? false,
          note: handout.note,
        },
        "handouts",
        "UPDATE",
        supabase
      );
    }
    form.reset({
      title: data.title,
      type: data.type,
      content: data.content,
      is_public: data.is_public,
      note: data.note,
    });
  };

  const [triggerReset, setTriggerReset] = useState(false);

  const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!triggerReset) return;
    timeOutRef.current = setTimeout(() => {
      setTriggerReset(false);
    }, 10);

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, [triggerReset]);

  const imageManager = new ImageManager();

  const prefix: ImageKeyPrefix | undefined =
    editingStage === "campaign"
      ? `campaigns/${editingId}/handouts/${handout.id}/images`
      : editingStage === "screen"
      ? `games/${editingId}/screens/${handout.screen_id}/handouts/${handout.id}/images`
      : undefined;

  const deleteHandout = async (h: Handout) => {
    if (!h) return;
    if (editingStage === "campaign" && h.content && prefix) {
      await imageManager.cleanImages(prefix, h.content);
    }
    if (editingStage === "screen" && h.content && prefix) {
      await imageManager.cleanImages(prefix, h.content);
    }
    if (editingStage === "campaign") {
      setCampaignData(
        h,
        {
          id: h.id,
          section_id: h.section_id,
        },
        "handouts",
        "DELETE",
        supabase
      );
    }
  };

  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <Card className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Collapsible>
            <div className="flex justify-between items-start w-full px-2">
              <CardHeader className="mt-2 flex flex-col gap-y-2 items-stretch grow">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("titlePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CollapsibleContent>
                  <div className="flex gap-x-2 w-full">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>{t("type")}</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                              defaultValue={handout.type ?? "text"}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t("typePlaceholder")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">
                                  {t("typeText")}
                                </SelectItem>
                                {/* <SelectItem value="image">圖片</SelectItem> */}
                                <SelectItem value="link">
                                  {t("typeLink")}
                                </SelectItem>
                                <SelectItem value="youtube">
                                  {t("typeYoutube")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_public"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1, leading-none">
                            <FormLabel>{t("isPublic")}</FormLabel>
                            <FormDescription className="hidden sm:block">
                              {t("isPublicDescription")}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </CardHeader>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0 mt-16">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-1 space-y-2">
                {!triggerReset && form.getValues("type") === "image" && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("editImage")} </FormLabel>
                        <FormControl>
                          <ImageEditor field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.getValues("type") === "link" && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("editLink")}</FormLabel>
                        <FormControl>
                          <LinkEditor field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.getValues("type") === "youtube" && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("editYoutube")}</FormLabel>
                        <FormControl>
                          <YoutubeEditor field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!triggerReset && form.getValues("type") === "text" && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("editText")}</FormLabel>
                        <FormControl>
                          <TextEditor
                            field={field}
                            oldValue={handout.content ?? undefined}
                            id={editingId ?? undefined}
                            prefix={prefix}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>

              <CardFooter className="flex gap-2 flex-col-reverse sm:justify-end sm:flex-row items-stretch sm:items-center">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setTriggerReset(true);
                    form.reset({
                      title: handout.title,
                      type: handout.type ?? "text",
                      content: handout.content ?? "",
                      is_public: handout.is_public ?? false,
                      note: handout.note ?? "",
                    });
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("save")}</Button>
              </CardFooter>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end p-4">
            {isDirty && (
              <div className="text-sm text-destructive">
                {t("unsavedChanges")}
              </div>
            )}
          </div>
        </form>
      </Form>

      <Button
        className="absolute top-0 right-0 rounded-full w-8 h-8"
        variant="ghost"
        size="icon"
        type="button"
        onClick={async (e) => {
          if (!handout.content) {
            deleteHandout(handout);
          } else {
            setOpenConfirm(true);
          }
        }}
      >
        <X className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        title={t("deleteHandout")}
        description={t("deleteHandoutDescription")}
        data={handout}
        onConfirm={deleteHandout}
      />
    </Card>
  );
}

interface Props {
  handout: Handout;
}
