import { Edge, Node } from "reactflow";

export const handleAddNodeOnEdge = (
  type: "action" | "ifElse",
  showEdgeMenu: { edge: Edge | null; position: { x: number; y: number } | null },
  nodes: Node[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>,
  setNewLabel: React.Dispatch<React.SetStateAction<string>>
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
      label: type === "action" ? `Action Node ${nodes.length}` : `If / Else Node ${nodes.length}`,
      onClick: () => {
        setSelectedNode({
          id: newNodeId,
          type: "custom",
          data: { label: type === "action" ? `Action Node ${nodes.length}` : `If / Else Node ${nodes.length}` },
          position: newNodePosition,
        });
        setNewLabel(type === "action" ? `Action Node ${nodes.length}` : `If / Else Node ${nodes.length}`);
      },
    },
    position: newNodePosition,
  };

  const newEdges = [
    { id: `${edge.source}-${newNodeId}`, source: edge.source, target: newNodeId, animated: true },
    { id: `${newNodeId}-${edge.target}`, source: newNodeId, target: edge.target, animated: true },
  ];

  if (type === "ifElse") {
    const branchNodeId = `branch-${nodes.length + 1}`;
    const branchNode: Node = {
      id: branchNodeId,
      type: "custom",
      data: {
        label: `Branch Node ${nodes.length + 1}`,
        onClick: () => {
          setSelectedNode(branchNode);
          setNewLabel(`Branch Node ${nodes.length + 1}`);
        },
      },
      position: { x: newNodePosition.x - 100, y: newNodePosition.y + 100 },
    };

    const elseNodeId = `else-${nodes.length + 2}`;
    const elseNode: Node = {
      id: elseNodeId,
      type: "custom",
      data: {
        label: `Else Node ${nodes.length + 2}`,
        onClick: () => {
          setSelectedNode(elseNode);
          setNewLabel(`Else Node ${nodes.length + 2}`);
        },
      },
      position: { x: newNodePosition.x + 100, y: newNodePosition.y + 100 },
    };

    newEdges.push(
      { id: `${newNodeId}-${branchNodeId}`, source: newNodeId, target: branchNodeId, animated: true },
      { id: `${newNodeId}-${elseNodeId}`, source: newNodeId, target: elseNodeId, animated: true }
    );

    setNodes((nds) => [...nds, newNode, branchNode, elseNode]);
  } else {
    setNodes((nds) => [...nds, newNode]);
  }

  setEdges((eds) => eds.filter((e) => e.id !== edge.id).concat(newEdges));
};

export const handleUpdateNode = (
  selectedNode: Node,
  newLabel: string,
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>
) => {
  setNodes((nds) =>
    nds.map((node) =>
      node.id === selectedNode.id ? { ...node, data: { ...node.data, label: newLabel } } : node
    )
  );
  setSelectedNode(null);
};

export const handleDeleteNode = (
  selectedNode: Node,
  nodes: Node[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>
) => {
  const connectedEdges = edges.filter(
    (edge) => edge.source === selectedNode.id || edge.target === selectedNode.id
  );

  if (connectedEdges.length === 2) {
    const [edge1, edge2] = connectedEdges;
    const newEdge: Edge = {
      id: `${edge1.source === selectedNode.id ? edge1.target : edge1.source}-${
        edge2.source === selectedNode.id ? edge2.target : edge2.source
      }`,
      source: edge1.source === selectedNode.id ? edge1.target : edge1.source,
      target: edge2.source === selectedNode.id ? edge2.target : edge2.source,
      animated: true,
    };

    setEdges((eds) =>
      eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id).concat(newEdge)
    );
  } else {
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id)
    );
  }

  setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
  setSelectedNode(null);
};

export const onNodeClick = (
  event: React.MouseEvent,
  node: Node,
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>,
  setNewLabel: React.Dispatch<React.SetStateAction<string>>
) => {
  event.stopPropagation();
  if (node.type === "custom") {
    setSelectedNode(node);
    setNewLabel(node.data.label);
  }
};
