"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { createClient } from "@/lib/supabase/client";
import { Handout } from "@/types/interfaces";
import MyMDXEditor from "@/components/MyMDXEditor";

const ImageEditor = dynamic(() => import("./ContentEditor/ImageEditor"), {
  ssr: false,
});
const LinkEditor = dynamic(() => import("./ContentEditor/LinkEditor"), {
  ssr: false,
});
const TextEditor = dynamic(() => import("./ContentEditor/TextEditor"), {
  ssr: false,
});
const YoutubeEditor = dynamic(() => import("./ContentEditor/YoutubeEditor"), {
  ssr: false,
});

const formSchema = z.object({
  title: z.string().optional(),
  type: z.enum(["text", "image", "link", "youtube"]).optional(),
  content: z.string().optional(),
  is_public: z.boolean(),
  note: z.string().optional(),
});

export type ContentFieldProps = ControllerRenderProps<
  z.infer<typeof formSchema>,
  "content"
>;

export default function HandoutCard({ handout, chapterId }: Props) {
  const { setCampaignData } = useCampaignStore();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.freeze(handout),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setCampaignData(
      {
        id: handout.id,
        title: data.title,
        type: data.type,
        content: data.content,
        is_public: data.is_public,
        note: data.note,
      },
      supabase,
      "handouts",
      "UPDATE"
    );
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

  return (
    <Card className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="mt-2 flex flex-col gap-y-2 items-stretch">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標題</FormLabel>
                  <FormControl>
                    <Input placeholder="標題" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-x-2 w-full">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>類型</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={handout.type}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選擇手邊資料類型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">文字</SelectItem>
                          {/* <SelectItem value="image">圖片</SelectItem> */}
                          <SelectItem value="link">連結</SelectItem>
                          <SelectItem value="youtube">Youtube</SelectItem>
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
                      <FormLabel>公開給玩家</FormLabel>
                      <FormDescription className="hidden sm:block">
                        讓玩家可以看到這篇手邊資料。
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 space-y-2">
            {!triggerReset && form.getValues("type") === "image" && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>編輯圖片</FormLabel>
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
                    <FormLabel>編輯連結</FormLabel>
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
                    <FormLabel>編輯 Youtube 連結</FormLabel>
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
                    <FormLabel>編輯文字</FormLabel>
                    <FormControl>
                      <TextEditor field={field} oldValue={handout.content} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!triggerReset && (
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>備註</FormLabel>
                    <FormControl>
                      <MyMDXEditor
                        markdown={field.value ?? ""}
                        onChange={(value) => field.onChange(value)}
                        oldMarkdown={handout.note}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end mt-4">
              {form.formState.isDirty && (
                <div className="text-sm text-destructive">有變更尚未儲存。</div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 mt-2 flex-col-reverse sm:justify-end sm:flex-row items-stretch sm:items-center">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setTriggerReset(true);
                form.reset();
              }}
            >
              取消
            </Button>
            <Button type="submit">儲存</Button>
          </CardFooter>
        </form>
      </Form>
      <Button
        className="absolute top-0 right-0 rounded-full w-8 h-8"
        variant="ghost"
        size="icon"
        type="button"
        onClick={(e) => {
          setCampaignData(
            {
              id: handout.id,
              section_id: handout.section_id,
            },
            supabase,
            "handouts",
            "DELETE"
          );
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </Card>
  );
}

interface Props {
  handout: Handout;
  chapterId: number;
}
