import React from "react";
import styled from "styled-components";

interface ActionBarProps {
  onDeleteSelected: () => void;
  onCompleteSelected: () => void;
  onIncompleteSelected: () => void;
  onMoveSelected: (targetColumnId: string) => void;
  selectedCount: number;
  columns: { id: string; name: string }[];
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #d1d5db;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background-color: #2563eb;
  }
`;

const ActionBar: React.FC<ActionBarProps> = ({
  onDeleteSelected,
  onCompleteSelected,
  onIncompleteSelected,
  onMoveSelected,
  selectedCount,
  columns,
}) => {
  return (
    <Bar>
      <div>
        {selectedCount} task{selectedCount !== 1 ? "s" : ""} selected
      </div>
      <div>
        <Button onClick={onCompleteSelected}>Mark Complete</Button>
        <Button onClick={onIncompleteSelected}>Mark Incomplete</Button>
        <Button onClick={onDeleteSelected}>Delete</Button>
        <select
          onChange={(e) => e.target.value && onMoveSelected(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Move to column...
          </option>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
      </div>
    </Bar>
  );
};

export default ActionBar;
