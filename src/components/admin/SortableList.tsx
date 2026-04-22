import { ReactNode } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '@/components/ui/icon';

interface SortableRowProps {
  id: string | number;
  children: ReactNode;
}

const SortableRow = ({ id, children }: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-stretch gap-3">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 px-2 rounded-xl hover:bg-muted cursor-grab active:cursor-grabbing grid place-items-center text-muted-foreground"
        title="Перетащить"
      >
        <Icon name="GripVertical" size={18} />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string | number;
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => ReactNode;
}

export function SortableList<T>({ items, getId, onReorder, renderItem }: SortableListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((it) => String(getId(it)) === String(active.id));
    const newIndex = items.findIndex((it) => String(getId(it)) === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((it) => getId(it))} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item) => (
            <SortableRow key={getId(item)} id={getId(item)}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default SortableList;
