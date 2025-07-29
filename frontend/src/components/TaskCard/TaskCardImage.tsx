import { Image, Button, Group, Stack, Text, FileButton } from "@mantine/core";
import { IconTrash, IconPhoto } from "@tabler/icons-react";
import { getImageUrl } from "../../config/api";

interface TaskCardImageProps {
  currentImage: string | null;
  isEditing: boolean;
  isCreating: boolean;
  onRemoveImage: () => void;
  onFileChange: (file: File | null) => void;
  imageError: string | null;
}

export function TaskCardImage({
  currentImage,
  isEditing,
  isCreating,
  onRemoveImage,
  onFileChange,
  imageError,
}: TaskCardImageProps) {
  return (
    <Stack>
      {currentImage && (
        <div style={{ position: "relative" }}>
          <Image
            src={getImageUrl(currentImage)}
            alt="Task"
            radius="md"
            height={180}
            fit="contain"
          />
          {(isCreating || isEditing) && (
            <Group
              style={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <Button
                size="xs"
                color="red"
                variant="filled"
                onClick={onRemoveImage}
                leftSection={<IconTrash size={12} />}
              >
                Удалить
              </Button>
            </Group>
          )}
        </div>
      )}
      {(isCreating || isEditing) && (
        <FileButton onChange={onFileChange} accept="image/*">
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
