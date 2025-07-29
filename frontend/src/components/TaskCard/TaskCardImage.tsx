import { Stack, Image, Button, Text, FileButton } from "@mantine/core";
import { IconTrash, IconPhoto } from "@tabler/icons-react";

interface TaskCardImageProps {
  currentImage: string | null;
  isEditing: boolean;
  isCreating: boolean;
  handleRemoveImage: () => void;
  handleFileChange: (file: File | null) => void;
  imageError: string | null;
}

export function TaskCardImage({
  currentImage,
  isEditing,
  isCreating,
  handleRemoveImage,
  handleFileChange,
  imageError,
}: TaskCardImageProps) {
  return (
    <Stack>
      {currentImage && (
        <Image
          src={
            currentImage.startsWith("/uploads/")
              ? `http://localhost:5000${currentImage}`
              : currentImage
          }
          alt="Task"
          radius="md"
          height={180}
          fit="contain"
        />
      )}
      {(isCreating || isEditing) && currentImage && (
        <Button
          variant="light"
          color="red"
          size="xs"
          leftSection={<IconTrash size={16} />}
          onClick={handleRemoveImage}
        >
          Удалить изображение
        </Button>
      )}
      {(isCreating || isEditing) && (
        <FileButton onChange={handleFileChange} accept="image/*">
          {(props) => (
            <Button
              variant="light"
              {...props}
              leftSection={<IconPhoto size={16} />}
            >
              {currentImage ? "Заменить изображение" : "Прикрепить изображение"}
            </Button>
          )}
        </FileButton>
      )}
      {imageError && (
        <Text color="red" size="sm" ta="center">
          {imageError}
        </Text>
      )}
    </Stack>
  );
}
