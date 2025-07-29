import { useState, useEffect, useMemo } from "react";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../services/tasksApi";
import { TaskCard } from "../components/TaskCard";
import type { TaskStatus } from "../types/index";
import {
  Stack,
  Title,
  Loader,
  Center,
  Alert,
  Text,
  Button,
  Group,
  Select,
  TextInput,
  Pagination,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { IconAlertCircle, IconPlus, IconFilter } from "@tabler/icons-react";
import dayjs from "dayjs";

const STATUS_OPTIONS: TaskStatus[] = ["В работе", "Готово", "Просрочено"];

export default function TasksPage() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [status, setStatus] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortDeadline, setSortDeadline] = useState<"asc" | "desc">("asc");
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Сброс страницы при изменении поиска или фильтров
  useEffect(() => {
    setPage(1);
  }, [search, status, sortDeadline]);

  const { data, isLoading, error, refetch } = useGetTasksQuery({
    page,
    limit,
    status: status || undefined,
    search: search || undefined,
    sortDeadline: sortDeadline,
  });
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleCreate = async (
    values: Partial<{
      description: string;
      status: TaskStatus;
      image?: string;
      deadline?: string;
      file?: File | null;
    }>
  ) => {
    if (!values.description?.trim() || !values.status) return;
    try {
      const taskData: any = {
        description: values.description.trim(),
        status: values.status,
        deadline: values.deadline,
      };
      if (values.file) {
        taskData.file = values.file;
      } else if (values.image) {
        taskData.image = values.image;
      }
      console.log("handleCreate: отправляемые данные:", taskData);
      const result = await createTask(taskData).unwrap();
      setIsCreatingCard(false);
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
      console.error("Failed to create task:", error);
    }
  };

  const handleEdit = async (
    id: number,
    values: Partial<{
      description: string;
      status: TaskStatus;
      image?: string;
      deadline?: string;
      file?: File | null;
    }>
  ) => {
    const task = data?.tasks.find((t) => t.id === id);
    if (!task) return;
    const updateData: any = {
      description: values.description ?? task.description,
      status: values.status ?? task.status,
      deadline: values.deadline ?? task.deadline,
    };
    if (values.file) {
      updateData.file = values.file;
    } else if (values.image) {
      updateData.image = values.image;
    }
    console.log("handleEdit: отправляемые данные:", updateData);
    try {
      await updateTask({
        id,
        data: updateData,
      }).unwrap();
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Ошибка редактирования задачи:", error);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id).unwrap();
    refetch();
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        Ошибка загрузки задач
      </Alert>
    );
  }

  return (
    <Stack
      p="xl"
      maw={700}
      mx="auto"
      bg="var(--mantine-color-white)"
      style={{
        borderRadius: "var(--mantine-radius-md)",
        boxShadow: "var(--mantine-shadow-sm)",
      }}
    >
      <Title order={2} ta="center" mb="md">
        Список задач
      </Title>
      <Center mb="md">
        <Flex
          gap={isMobile ? "sm" : "md"}
          align="flex-end"
          direction={isMobile ? "column" : "row"}
          w="100%"
          maw={isMobile ? 400 : 600}
        >
          <Select
            label="Статус"
            data={[
              { value: "", label: "Все" },
              ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
            ]}
            value={status || ""}
            onChange={(v) => setStatus(v || null)}
            w={isMobile ? "100%" : "auto"}
            maw={isMobile ? undefined : 120}
            styles={{
              label: {
                whiteSpace: "nowrap",
              },
            }}
          />
          <Select
            label="Сортировка по дедлайну"
            data={[
              { value: "asc", label: "По возрастанию" },
              { value: "desc", label: "По убыванию" },
            ]}
            value={sortDeadline}
            onChange={(v) => setSortDeadline((v as "asc" | "desc") || "asc")}
            w={isMobile ? "100%" : "auto"}
            maw={isMobile ? undefined : 200}
            styles={{
              label: {
                whiteSpace: "nowrap",
              },
            }}
          />
          <TextInput
            label="Поиск по описанию"
            placeholder="Введите текст для поиска..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.currentTarget.value)}
            rightSection={searchInput !== search ? <Loader size="xs" /> : null}
            rightSectionWidth={20}
            w={isMobile ? "100%" : "auto"}
            maw={isMobile ? undefined : 200}
            styles={{
              input: {
                height: 36,
              },
              label: {
                whiteSpace: "nowrap",
              },
            }}
          />
        </Flex>
      </Center>
      <Center mb="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsCreatingCard(true)}
          disabled={isCreatingCard}
        >
          Новая задача
        </Button>
      </Center>
      {isCreatingCard && (
        <TaskCard
          description=""
          status={"В работе"}
          isCreating={true}
          onChange={async (values) => {
            if (!values.description || values.description.trim() === "") {
              setIsCreatingCard(false);
            } else if (values.description && values.status) {
              await handleCreate(values);
            }
          }}
        />
      )}
      {data?.tasks.length ? (
        data.tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            description={task.description}
            status={task.status as TaskStatus}
            deadline={task.deadline}
            image={task.image}
            isEditing={editingId === task.id}
            onEditClick={() => setEditingId(task.id!)}
            onCancelEdit={() => setEditingId(null)}
            onImageDeleted={() => refetch()}
            onChange={
              editingId === task.id
                ? async (values) => {
                    await handleEdit(task.id!, values);
                  }
                : undefined
            }
            onDelete={() => handleDelete(task.id!)}
          />
        ))
      ) : (
        <Center>
          <Text color="dimmed" size="lg">
            {search ? `Задачи по запросу "${search}" не найдены` : "Нет задач"}
          </Text>
        </Center>
      )}
      {data && data.totalPages > 1 && (
        <Pagination
          value={page}
          onChange={setPage}
          total={data.totalPages}
          mt="md"
        />
      )}
    </Stack>
  );
}
