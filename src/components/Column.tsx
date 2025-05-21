import React, { useState } from "react";
import styled from "styled-components";
import Task from "./Task";
import { TaskType, ColumnType } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const ColumnWrapper = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  transform-origin: top left;
`;

const SortableContainer = styled.div`
  touch-action: manipulation;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TitleInput = styled.input`
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  background: transparent;
  width: 100%;
  &:focus {
    outline: none;
    background: #f0f0f0;
  }
`;

const Button = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const NewTaskInput = styled.input`
  margin-top: 0.5rem;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
`;

const SelectAllCheckbox = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const DragHandle = styled.div`
  cursor: grab;
  padding: 0.25rem;
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const EmptyDropZone = styled.div`
  height: 50px;
  border: 2px dashed #9ca3af;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

type Props = {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (columnId: string, text: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onToggleTask: (columnId: string, taskId: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onEditTask: (columnId: string, taskId: string, text: string) => void;
  onSelectTask: (taskId: string, selected: boolean) => void;
  selectedTaskIds: string[];
  onEditColumnName: (columnId: string, newName: string) => void;
};

const Column: React.FC<Props> = ({
  column,
  tasks,
  onAddTask,
  onDeleteColumn,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onSelectTask,
  selectedTaskIds,
  onEditColumnName,
}) => {
  const [newTask, setNewTask] = useState("");
  const [title, setTitle] = useState(column.name);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTask.trim()) {
      onAddTask(column.id, newTask.trim());
      setNewTask("");
    }
  };

  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== column.name) {
      onEditColumnName(column.id, title.trim());
    } else {
      setTitle(column.name);
    }
  };

  const areAllTasksSelected = tasks.every((t) =>
    selectedTaskIds.includes(t.id)
  );
  const toggleAllTasks = () => {
    tasks.forEach((task) => onSelectTask(task.id, !areAllTasksSelected));
  };

  return (
    <SortableContainer ref={setNodeRef} style={style} {...attributes}>
      <ColumnWrapper>
        <ColumnHeader>
          <DragHandle {...listeners}>::</DragHandle>
          <TitleInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
          />
          <Button onClick={() => onDeleteColumn(column.id)}>X</Button>
        </ColumnHeader>

        {tasks.length > 0 && (
          <SelectAllCheckbox>
            <input
              type="checkbox"
              checked={areAllTasksSelected}
              onChange={toggleAllTasks}
            />
            Select All
          </SelectAllCheckbox>
        )}
        <SortableContainer ref={setNodeRef} style={style}>
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.length === 0 ? (
              <EmptyDropZone />
            ) : (
              tasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  columnId={column.id}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onSelect={onSelectTask}
                  isSelected={selectedTaskIds.includes(task.id)}
                />
              ))
            )}
          </SortableContext>
        </SortableContainer>
        <NewTaskInput
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </ColumnWrapper>
    </SortableContainer>
  );
};

export default Column;
