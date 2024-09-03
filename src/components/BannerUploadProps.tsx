import React, { useRef } from "react";
import Image from "next/image";
import { FormItem, FormLabel } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { X } from "lucide-react";

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
      <div className="w-full h-72 border border-border p-2 flex justify-center items-center rounded-sm relative">
        {(initialUrl || file) && (
          <Image
            className="object-cover"
            src={file ? URL.createObjectURL(file) : initialUrl!}
            alt="banner"
            loader={({ src }) => src}
            fill
            unoptimized
          />
        )}
        {(file || initialUrl) && (
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

export default ImageUploadFormItem;
