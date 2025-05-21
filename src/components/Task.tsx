import React, { useState } from "react";
import styled from "styled-components";
import { TaskType } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

const TaskWrapper = styled.div<{ completed: boolean }>`
  background-color: ${({ completed }) => (completed ? "#cbd5e1" : "#f3f4f6")};
  padding: 0.5rem;
  border: 2px solid ${({ completed }) => (completed ? "#4b5563" : "#9ca3af")};
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
`;

const Text = styled.span<{ completed: boolean }>`
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  flex-grow: 1;
  color: ${({ completed }) => (completed ? "#4b5563" : "#1f2937")};
  font-weight: 500;
`;

const TextInput = styled.input`
  flex-grow: 1;
  padding: 0.25rem;
  background-color: #f9fafb;
  border: 1px solid #9ca3af;
  border-radius: 0.25rem;
  color: #111827;
`;

const Button = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #dc2626;
  }
`;

const DragHandle = styled.div`
  cursor: grab;
  padding: 0.25rem;
  font-size: 1.2rem;
  color: #6b7280;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
`;

type Props = {
  task: TaskType;
  columnId: string;
  onToggle: (columnId: string, taskId: string) => void;
  onDelete: (columnId: string, taskId: string) => void;
  onEdit: (columnId: string, taskId: string, text: string) => void;
  onSelect: (taskId: string, selected: boolean) => void;
  isSelected: boolean;
};

const Task: React.FC<Props> = ({
  task,
  columnId,
  onToggle,
  onDelete,
  onEdit,
  onSelect,
  isSelected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onEdit(columnId, task.id, text);
    }
  };

  return (
    <TaskWrapper ref={setNodeRef} style={style} completed={task.completed}>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onSelect(task.id, !isSelected);
        }}
        aria-label="Select Task"
      >
        {isSelected ? (
          <FaCheckSquare color="#2563eb" />
        ) : (
          <FaRegSquare color="#9ca3af" />
        )}
      </IconButton>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          console.log("completed");
          onToggle(columnId, task.id);
        }}
        aria-label="Toggle Completion"
      >
        {task.completed ? (
          <FaCheckSquare color="#16a34a" />
        ) : (
          <FaRegSquare color="#9ca3af" />
        )}
      </IconButton>

      {isEditing ? (
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setIsEditing(false);
            onEdit(columnId, task.id, text);
          }}
          autoFocus
        />
      ) : (
        <Text completed={task.completed} onClick={() => setIsEditing(true)}>
          {task.text}
        </Text>
      )}

      <DragHandle {...listeners} {...attributes}>
        ::
      </DragHandle>

      <Button onClick={() => onDelete(columnId, task.id)}>X</Button>
    </TaskWrapper>
  );
};

export default Task;
