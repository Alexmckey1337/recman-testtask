import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { DragEndEvent } from "@dnd-kit/core";
import { ColumnType, TaskType } from "../types";

export interface TasksMap {
  [columnId: string]: TaskType[];
}

function useTodo() {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const stored = localStorage.getItem("columns");
    return stored ? JSON.parse(stored) : [];
  });
  const [tasks, setTasks] = useState<TasksMap>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : {};
  });
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [taskFilter, setTaskFilter] = useState<
    "all" | "completed" | "uncompleted"
  >("all");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedColumns = localStorage.getItem("columns");

    if (storedTasks && storedColumns) {
      setTasks(JSON.parse(storedTasks));
      setColumns(JSON.parse(storedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const addColumn = () => {
    const newColumn = { id: uuid(), title: "New Column", name: "New Column" };
    setColumns((prev) => [...prev, newColumn]);
  };

  const editColumnName = (columnId: string, newName: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, name: newName } : col))
    );
  };

  const deleteColumn = (columnId: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
    setTasks((prev) => {
      const updated = { ...prev };
      delete updated[columnId];
      return updated;
    });
  };

  const addTask = (columnId: string, text: string) => {
    const newTask: TaskType = {
      id: uuid(),
      text,
      completed: false,
    };
    setTasks((prev) => ({
      ...prev,
      [columnId]: [...(prev[columnId] || []), newTask],
    }));
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setTasks((prev) => {
      const updated = {
        ...prev,
        [columnId]: prev[columnId]?.filter((task) => task.id !== taskId),
      };
      console.log("Updated tasks:", updated);
      return updated;
    });
  };

  const toggleTask = (columnId: string, taskId: string) => {
    setTasks((prev) => {
      const updatedColumn = prev[columnId].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      return {
        ...prev,
        [columnId]: updatedColumn,
      };
    });
  };

  const editTask = (taskId: string, newText: string) => {
    setTasks((prev) => {
      const updated: TasksMap = {};
      for (const columnId in prev) {
        updated[columnId] = prev[columnId].map((task) =>
          task.id === taskId ? { ...task, text: newText } : task
        );
      }
      return updated;
    });
  };

  const selectTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const completeSelected = () => {
    setTasks((prev) => {
      const updated: TasksMap = {};
      for (const columnId in prev) {
        updated[columnId] = prev[columnId].map((task) =>
          selectedTaskIds.includes(task.id)
            ? { ...task, completed: true }
            : task
        );
      }
      return updated;
    });
  };

  const incompleteSelected = () => {
    setTasks((prev) => {
      const updated: TasksMap = {};
      for (const columnId in prev) {
        updated[columnId] = prev[columnId].map((task) =>
          selectedTaskIds.includes(task.id)
            ? { ...task, completed: false }
            : task
        );
      }
      return updated;
    });
  };

  const deleteSelected = () => {
    selectedTaskIds.forEach((taskId) => {
      const columnId = Object.keys(tasks).find((colId) =>
        tasks[colId].some((task) => task.id === taskId)
      );
      if (columnId) {
        deleteTask(columnId, taskId);
      }
    });
  };

  const moveSelected = (targetColumnId: string) => {
    const movingTasks: TaskType[] = [];
    const updated: TasksMap = {};
    for (const columnId in tasks) {
      updated[columnId] = tasks[columnId].filter((task) => {
        const selected = selectedTaskIds.includes(task.id);
        if (selected) movingTasks.push(task);
        return !selected;
      });
    }
    updated[targetColumnId] = [
      ...(updated[targetColumnId] || []),
      ...movingTasks,
    ];
    setTasks(updated);
    setSelectedTaskIds([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (columns.find((col) => col.id === active.id)) {
      if (active.id !== over.id) {
        const oldIndex = columns.findIndex((col) => col.id === active.id);
        const newIndex = columns.findIndex((col) => col.id === over.id);

        const updated = [...columns];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);
        setColumns(updated);
      }
      return;
    }

    const sourceColumnId = Object.keys(tasks).find((colId) =>
      tasks[colId].some((task) => task.id === active.id)
    );

    const destinationColumnId = over.id;

    if (
      !sourceColumnId ||
      !destinationColumnId ||
      sourceColumnId === destinationColumnId
    )
      return;

    const sourceTasks = [...tasks[sourceColumnId]];
    const destinationTasks = [...(tasks[destinationColumnId] || [])];

    const taskIndex = sourceTasks.findIndex((task) => task.id === active.id);
    const [movedTask] = sourceTasks.splice(taskIndex, 1);
    destinationTasks.push(movedTask);

    setTasks({
      ...tasks,
      [sourceColumnId]: sourceTasks,
      [destinationColumnId]: destinationTasks,
    });
  };

  return {
    columns,
    tasks,
    selectedTaskIds,
    addColumn,
    deleteColumn,
    addTask,
    editColumnName,
    deleteTask,
    toggleTask,
    editTask,
    selectTask,
    handleDragEnd,
    moveSelected,
    incompleteSelected,
    deleteSelected,
    completeSelected,
    taskFilter,
    setTaskFilter,
  };
}

export default useTodo;
