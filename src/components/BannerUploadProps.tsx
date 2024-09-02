import React, { useRef } from "react";
import Image from "next/image";
import { FormItem, FormLabel } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { X } from "lucide-react";

interface Props {
  initialBannerUrl?: string | null | undefined;
  file: File | null;
  setFile: (file: File | null) => void;
  onBannerUrlClear: () => void;
  label: string;
  placeholder: string;
}

const BannerUploadFormItem: React.FC<Props> = ({
  initialBannerUrl,
  file,
  setFile,
  onBannerUrlClear,
  label,
  placeholder,
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
      onBannerUrlClear();
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
      <div className="w-full h-72 border border-border p-2 flex justify-center items-center rounded-sm relative">
        {(initialBannerUrl || file) && (
          <Image
            className="object-cover"
            src={file ? URL.createObjectURL(file) : initialBannerUrl!}
            alt="banner"
            loader={({ src }) => src}
            fill
            unoptimized
          />
        )}
        {(file || initialBannerUrl) && (
          <Button
            className="absolute top-0 right-0"
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </FormItem>
  );
};

export default BannerUploadFormItem;
