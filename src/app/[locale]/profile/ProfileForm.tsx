"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ImageUploadFormItem from "@/components/BannerUploadProps";
import ImageManager from "@/lib/ImageManager";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  display_name: z.string().min(1),
  avatar_url: z.string().optional(),
});

export default function ProfileForm() {
  const t = useTranslations("ProfileForm");

  return <div className="flex flex-col gap-2 w-full max-w-md p-4"></div>;
}
