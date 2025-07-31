import { Button, Paper, Stack, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import type { SubmitHandler, RegisterOptions } from "react-hook-form";
import { TextInputField } from "../components/form/TextInputField";
import { useUpdateUserMutation, useGetProfileQuery } from "../services/authApi";
import { useEffect, useMemo } from "react";
import type { ProfileFormValues } from "../types/types-exports";

const nameRules: RegisterOptions<ProfileFormValues> = {
  required: "Имя обязательно",
  minLength: { value: 2, message: "Имя слишком короткое" },
};

export default function UserProfilePage() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
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
    <Stack
      p={isMobile ? "md" : "xl"}
      maw={700}
      mx="auto"
      mt={isMobile ? "md" : "xl"}
      bg="var(--mantine-color-white)"
      style={{
        borderRadius: "var(--mantine-radius-md)",
        boxShadow: "var(--mantine-shadow-sm)",
      }}
    >
      <Paper
        maw={isMobile ? "100%" : 400}
        w="100%"
        p={isMobile ? "md" : "lg"}
        shadow="md"
        radius="md"
        mx="auto"
      >
        <Title order={isMobile ? 3 : 2} ta="center" mb={isMobile ? "md" : "lg"}>
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
