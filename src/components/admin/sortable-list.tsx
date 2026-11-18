"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Drag-and-drop list (Case 03 M4, dnd-kit). Works with mouse, touch, and keyboard
 * (focus the handle, Space to pick up, arrows to move, Space to drop).
 * `onReorder` gets the new id order; the list updates right away.
 */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  label,
}: {
  items: T[];
  onReorder: (ids: string[]) => void;
  renderItem: (item: T) => ReactNode;
  label: string;
}) {
  const [sourceItems, setSourceItems] = useState(items);
  const [ordered, setOrdered] = useState(items);
  // New data from the server (after a refresh) replaces the local order.
  if (items !== sourceItems) {
    setSourceItems(items);
    setOrdered(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = ordered.findIndex((item) => item.id === active.id);
    const to = ordered.findIndex((item) => item.id === over.id);
    const next = arrayMove(ordered, from, to);
    setOrdered(next);
    onReorder(next.map((item) => item.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ordered} strategy={verticalListSortingStrategy}>
        <ul aria-label={label} className="flex flex-col gap-2">
          {ordered.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-card px-2 py-2",
        isDragging && "relative z-10 shadow-lg ring-1 ring-primary/40",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab rounded p-1 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon aria-hidden="true" className="size-4" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
    </li>
  );
}
