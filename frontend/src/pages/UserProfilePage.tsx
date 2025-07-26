import { Button, Paper, Stack, Title, Flex } from "@mantine/core";
import { useForm } from "react-hook-form";
import type { SubmitHandler, RegisterOptions } from "react-hook-form";
import { TextInputField } from "../components/form/TextInputField";
import { useUpdateUserMutation, useGetProfileQuery } from "../services/authApi";
import { useEffect, useMemo } from "react";

interface ProfileFormValues {
  name: string;
}

const nameRules: RegisterOptions<ProfileFormValues> = {
  required: "Имя обязательно",
  minLength: { value: 2, message: "Имя слишком короткое" },
};

export default function UserProfilePage() {
  const { data: user, refetch } = useGetProfileQuery();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<ProfileFormValues>({
    mode: "onTouched",
    defaultValues: { name: user?.name || "" },
  });
  const [updateUser, { isLoading: isUpdating, error: updateError, isSuccess }] =
    useUpdateUserMutation();

  const currentName = watch("name");
  const isNameChanged = useMemo(
    () => currentName !== user?.name,
    [currentName, user?.name]
  );

  useEffect(() => {
    if (user) reset({ name: user.name });
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      await updateUser({ newName: data.name }).unwrap();
      refetch();
    } catch (e) {
      // обработка ошибки
    }
  };

  return (
    <Stack p="xl" maw={700} mx="auto" mt="xl">
      <Paper maw={400} w="100%" p="lg" shadow="md" radius="md" mx="auto">
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
            <Button
              type="submit"
              fullWidth
              mt="md"
              loading={isUpdating}
              disabled={!isNameChanged || !isDirty}
            >
              Сохранить
            </Button>
            {isSuccess && (
              <div style={{ color: "green" }}>Имя успешно обновлено</div>
            )}
            {updateError && (
              <div style={{ color: "red" }}>Ошибка обновления</div>
            )}
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
