import { Button, Paper, Stack, Title, Flex } from "@mantine/core";
import { useForm } from "react-hook-form";
import type { SubmitHandler, RegisterOptions } from "react-hook-form";
import { TextInputField } from "../components/form/TextInputField";

interface ProfileFormValues {
  name: string;
}

const nameRules: RegisterOptions<ProfileFormValues> = {
  required: "Имя обязательно",
  minLength: { value: 2, message: "Имя слишком короткое" },
};

export default function UserProfilePage() {
  const { control, handleSubmit } = useForm<ProfileFormValues>({
    mode: "onTouched",
    defaultValues: { name: "" }, // Можно подставить текущее имя пользователя
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    // логика обновления имени пользователя
    console.log("Новое имя:", data.name);
  };

  return (
    <Flex justify="center" align="center" h="100vh">
      <Paper maw={400} w="100%" p="lg" shadow="md" radius="md">
        <Title order={2} style={{ textAlign: "center", marginBottom: 16 }}>
          Изменить имя пользователя
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInputField
              name="name"
              control={control}
              label="Имя"
              placeholder="Введите новое имя"
              rules={nameRules}
              autoComplete="off"
            />
            <Button type="submit" fullWidth mt="md">
              Сохранить
            </Button>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
}
