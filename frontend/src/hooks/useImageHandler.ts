import { useState } from "react";
import type { UseImageHandlerProps } from "../types";

export function useImageHandler({ initialImage, onImageChange }: UseImageHandlerProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage);
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setImageError(null);

    if (!newFile) {
      setFile(null);
      setCurrentImage(null);
      onImageChange?.(null, null);
      return;
    }

    if (!newFile.type.startsWith("image/")) {
      setImageError("Можно загружать только изображения (jpeg, png, webp и др.)");
      return;
    }

    if (newFile.size > 5 * 1024 * 1024) {
      setImageError("Максимальный размер изображения — 5 МБ");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          setImageError("Максимальное разрешение изображения — 1920x1080");
          return;
        }
        setFile(newFile);
        setCurrentImage(e.target?.result as string);
        onImageChange?.(newFile, e.target?.result as string);
      };
      img.onerror = () => {
        setImageError("Ошибка загрузки изображения");
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setImageError("Ошибка чтения файла");
    };
    reader.readAsDataURL(newFile);
  };

  const handleRemoveImage = () => {
    setCurrentImage(null);
    setFile(null);
    setImageError(null);
    onImageChange?.(null, null);
  };

  const resetImageError = () => {
    setImageError(null);
  };

  return {
    currentImage,
    file,
    imageError,
    handleFileChange,
    handleRemoveImage,
    resetImageError,
    setCurrentImage,
  };
} 