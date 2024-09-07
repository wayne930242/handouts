import React, { useRef } from "react";
import Image from "next/image";
import { FormItem, FormLabel } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  url?: string | null | undefined;
  file: File | null;
  setFile: (file: File | null) => void;
  onSetFileCancelled?: () => void;
  onUrlClear?: () => void;
  label: string;
  placeholder: string;
  type: "banner" | "avatar";
}

const ImageUploadFormItem: React.FC<Props> = ({
  url,
  file,
  setFile,
  onSetFileCancelled,
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
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (file) {
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onSetFileCancelled?.();
    } else {
      onUrlClear?.();
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
        className={cn(
          "cursor-pointer relative flex justify-center border-2 items-center border-border p-2",
          {
            "w-full rounded-sm aspect-[24/9]": type === "banner",
            "h-36 w-36 rounded-full": type === "avatar",
          }
        )}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {(url || file) && (
          <Image
            className={cn("object-cover", {
              "rounded-full": type === "avatar",
            })}
            src={file ? URL.createObjectURL(file) : url!}
            alt="banner"
            loader={({ src }) => src}
            fill
            unoptimized
          />
        )}
        {(file || url) && (
          <Button
            className="absolute -top-3 -right-3"
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
