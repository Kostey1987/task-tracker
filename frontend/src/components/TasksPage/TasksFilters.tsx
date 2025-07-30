import { useMemo } from "react";
import {
  Flex,
  Select,
  TextInput,
  Loader,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { TaskStatus, TasksFiltersProps } from "../../types/types-exports";
import { useTasksUI } from "../../hooks/hooks-exports";
import React from "react";

const STATUS_OPTIONS: TaskStatus[] = ["В работе", "Готово", "Просрочено"];

function TasksFiltersComponent({}: TasksFiltersProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Получаем состояние UI из Redux
  const {
    status,
    searchInput,
    sortDeadline,
    isSearching,
    handleStatusChange,
    handleSearchChange,
    handleSortChange,
  } = useTasksUI();

  // Мемоизированные данные для селектов
  const statusData = useMemo(
    () => [
      { value: "", label: "Все" },
      ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
    ],
    []
  );

  const sortData = useMemo(
    () => [
      { value: "asc", label: "По возрастанию" },
      { value: "desc", label: "По убыванию" },
    ],
    []
  );

  // Мемоизированные стили
  const commonStyles = useMemo(
    () => ({
      label: {
        whiteSpace: "nowrap" as const,
      },
    }),
    []
  );

  const inputStyles = useMemo(
    () => ({
      input: {
        height: 36,
      },
      label: {
        whiteSpace: "nowrap" as const,
      },
    }),
    []
  );

  return (
    <Flex
      gap={isMobile ? "sm" : "md"}
      align="flex-end"
      direction={isMobile ? "column" : "row"}
      w="100%"
      maw={isMobile ? 400 : 600}
    >
      <Select
        label="Статус"
        data={statusData}
        value={status || ""}
        onChange={(v) => handleStatusChange((v as TaskStatus) || null)}
        w={isMobile ? "100%" : "auto"}
        maw={isMobile ? "100%" : 120}
        styles={commonStyles}
      />
      <Select
        label="Сортировка по дедлайну"
        data={sortData}
        value={sortDeadline}
        onChange={(v) => handleSortChange((v as "asc" | "desc") || "asc")}
        w={isMobile ? "100%" : "auto"}
        maw={isMobile ? "100%" : 200}
        styles={commonStyles}
      />
      <TextInput
        label="Поиск по описанию"
        placeholder="Введите текст для поиска..."
        value={searchInput}
        onChange={(e) => handleSearchChange(e.currentTarget.value)}
        rightSection={isSearching ? <Loader size="xs" /> : null}
        rightSectionWidth={20}
        w={isMobile ? "100%" : "auto"}
        maw={isMobile ? "100%" : 200}
        styles={inputStyles}
      />
    </Flex>
  );
}

export const TasksFilters = React.memo(TasksFiltersComponent);
