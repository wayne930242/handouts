import React, { useRef } from "react";
import Image from "next/image";
import { FormItem, FormLabel } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  initialUrl?: string | null | undefined;
  file: File | null;
  setFile: (file: File | null) => void;
  onUrlClear: () => void;
  label: string;
  placeholder: string;
  type: "banner" | "avatar";
}

const ImageUploadFormItem: React.FC<Props> = ({
  initialUrl,
  file,
  setFile,
  onUrlClear,
  label,
  placeholder,
  type,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    if (file) {
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else {
      onUrlClear();
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
      />
      <div
        className={cn("relative flex justify-center items-center", {
          "h-72 w-full border border-border p-2 rounded-sm": type === "banner",
          "h-36 w-36 rounded-full": type === "avatar",
        })}
      >
        {(initialUrl || file) && (
          <Image
            className={cn("object-cover", {
              "rounded-full": type === "avatar",
            })}
            src={file ? URL.createObjectURL(file) : initialUrl!}
            alt="banner"
            loader={({ src }) => src}
            fill
            unoptimized
          />
        )}
        {(file || initialUrl) && (
          <Button
            className="absolute top-0 right-0 h-6 w-6"
            type="button"
            size="icon"
            variant="link"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </FormItem>
  );
};

export default ImageUploadFormItem;
