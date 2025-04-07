import { Edge } from "reactflow";

export const onEdgeClick = (
  event: React.MouseEvent,
  edge: Edge,
  setShowEdgeMenu: React.Dispatch<
    React.SetStateAction<{ edge: Edge | null; position: { x: number; y: number } | null }>
  >
) => {
  event.stopPropagation();
  setShowEdgeMenu({ edge, position: { x: event.clientX, y: event.clientY } });
};
