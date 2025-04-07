import { Edge, Node } from "reactflow";

export const handleAddIfElseNode = (
  type: "ifElse",
  showEdgeMenu: { edge: Edge | null; position: { x: number; y: number } | null },
  nodes: Node[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>,
  setBranchNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  if (!showEdgeMenu.edge) return;

  const { edge } = showEdgeMenu;
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);
  if (!sourceNode || !targetNode) return;

  const newNodePosition = {
    x: (sourceNode.position.x + targetNode.position.x) / 2,
    y: (sourceNode.position.y + targetNode.position.y) / 2,
  };

  const newNodeId = `${type}-${nodes.length}`;
  const newNode: Node = {
    id: newNodeId,
    type: "custom",
    data: {
      label: `If / Else Node ${nodes.length}`,
      onClick: () => {
        setSelectedNode(newNode); // Open the "If / Else" form
      },
    },
    position: newNodePosition,
  };

  const branchNodeId = `branch-${nodes.length + 1}`;
  const branchNode: Node = {
    id: branchNodeId,
    type: "custom",
    data: {
      label: `Branch Node ${nodes.length + 1}`,
    },
    position: { x: newNodePosition.x - 100, y: newNodePosition.y + 100 },
  };

  const elseNodeId = `else-${nodes.length + 2}`;
  const elseNode: Node = {
    id: elseNodeId,
    type: "custom",
    data: {
      label: `Else Node ${nodes.length + 2}`,
    },
    position: { x: newNodePosition.x + 100, y: newNodePosition.y + 100 },
  };

  const newEdges = [
    { id: `${edge.source}-${newNodeId}`, source: edge.source, target: newNodeId, animated: true },
    { id: `${newNodeId}-${branchNodeId}`, source: newNodeId, target: branchNodeId, animated: true },
    { id: `${newNodeId}-${elseNodeId}`, source: newNodeId, target: elseNodeId, animated: true },
    { id: `${newNodeId}-${edge.target}`, source: newNodeId, target: edge.target, animated: true },
  ];

  setNodes((nds) => [...nds, newNode, branchNode, elseNode]);
  setEdges((eds) => eds.filter((e) => e.id !== edge.id).concat(newEdges));

  // Add the default branch and else node to branchNames
  setBranchNames((prev) => ({
    ...prev,
    [branchNodeId]: `Branch Node ${nodes.length + 1}`,
    [elseNodeId]: `Else Node ${nodes.length + 2}`, // Add Else node to branchNames
  }));
};
