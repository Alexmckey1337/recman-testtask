import React from "react";
import useTodo from "./hooks/useTodo";
import Column from "./components/Column";
import styled from "styled-components";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ActionBar from "./components/ActionBar";

const AppWrapper = styled.div`
  padding: 1rem;
  min-height: 100vh;
  background-color: rgb(49, 136, 222);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
`;

const Button = styled.button<{ bg?: string }>`
  background-color: ${(props) => props.bg || "#3b82f6"};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  border: 1px white solid;
  cursor: pointer;
  margin-right: 0.5rem;
  &:hover {
    opacity: 0.9;
  }
`;

const App: React.FC = () => {
  const {
    columns,
    tasks,
    selectedTaskIds,
    addColumn,
    deleteColumn,
    addTask,
    deleteTask,
    toggleTask,
    editTask,
    selectTask,
    handleDragEnd,
    completeSelected,
    incompleteSelected,
    deleteSelected,
    moveSelected,
    editColumnName,
    taskFilter,
    setTaskFilter,
  } = useTodo();

  const getFilteredTasks = (columnId: string) => {
    const allTasks = tasks[columnId] || [];
    if (taskFilter === "completed")
      return allTasks.filter((task) => task.completed);
    if (taskFilter === "uncompleted")
      return allTasks.filter((task) => !task.completed);
    return allTasks;
  };

  return (
    <AppWrapper>
      <TopBar>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Kanban Board</h1>
        <div>
          <Button onClick={() => setTaskFilter("all")}>All</Button>
          <Button onClick={() => setTaskFilter("completed")}>Completed</Button>
          <Button onClick={() => setTaskFilter("uncompleted")}>
            Uncompleted
          </Button>
        </div>
        <Button bg="#16a34a" onClick={addColumn}>
          + Column
        </Button>
      </TopBar>

      {selectedTaskIds.length > 0 && (
        <ActionBar
          selectedCount={selectedTaskIds.length}
          onCompleteSelected={completeSelected}
          onIncompleteSelected={incompleteSelected}
          onDeleteSelected={deleteSelected}
          onMoveSelected={moveSelected}
          columns={columns.map(({ id, name }) => ({ id, name }))}
        />
      )}

      <ColumnsContainer>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={verticalListSortingStrategy}
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getFilteredTasks(column.id) || []}
                onAddTask={addTask}
                onDeleteColumn={deleteColumn}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
                onSelectTask={selectTask}
                selectedTaskIds={selectedTaskIds}
                onEditColumnName={editColumnName}
              />
            ))}
          </SortableContext>
        </DndContext>
      </ColumnsContainer>
    </AppWrapper>
  );
};

export default App;
