import { Edge, Node } from "reactflow";

export const handleAddBranch = (
  selectedNode: Node | null,
  nodes: Node[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  branchNames: { [key: string]: string },
  setBranchNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>,
  setNewLabel: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!selectedNode) return;

  // Find all branch nodes and the "Else" node connected to the selected If / Else node
  const connectedNodes = edges
    .filter((edge) => edge.source === selectedNode.id)
    .map((edge) => nodes.find((node) => node.id === edge.target))
    .filter((node): node is Node => !!node);

  // Separate branch nodes and the "Else" node
  const branchNodes = connectedNodes.filter((node) => !node.id.includes("else"));
  const elseNode = connectedNodes.find((node) => node.id.includes("else"));

  // Determine the rightmost branch node
  const rightmostBranchNode = branchNodes.reduce((rightmost, node) => {
    return node.position.x > rightmost.position.x ? node : rightmost;
  }, branchNodes[0]);

  // Calculate the new branch position between the rightmost branch node and the Else node
  const newBranchPosition = elseNode
    ? {
        x: (rightmostBranchNode.position.x + elseNode.position.x) / 2,
        y: (rightmostBranchNode.position.y + elseNode.position.y) / 2,
      }
    : {
        x: rightmostBranchNode.position.x + 150, // Default position if Else node is not found
        y: rightmostBranchNode.position.y,
      };

  // Create the new branch node
  const newBranchId = `branch-${nodes.length + 1}`;
  const newBranchNode: Node = {
    id: newBranchId,
    type: "custom",
    data: { label: `Branch Node ${nodes.length + 1}` },
    position: newBranchPosition,
  };

  // Create the new edge connecting the If / Else node to the new branch node
  const newEdge: Edge = {
    id: `${selectedNode.id}-${newBranchId}`,
    source: selectedNode.id,
    target: newBranchId,
    animated: true,
  };

  // Update state
  setNodes((nds) => [...nds, newBranchNode]);
  setEdges((eds) => [...eds, newEdge]);
  setBranchNames((prev) => ({ ...prev, [newBranchId]: `Branch Node ${nodes.length + 1}` }));
};

export const handleBranchNameChange = (
  branchId: string,
  newName: string,
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  branchNames: { [key: string]: string },
  setBranchNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  setBranchNames((prev) => ({ ...prev, [branchId]: newName }));
  setNodes((nds) =>
    nds.map((node) =>
      node.id === branchId ? { ...node, data: { ...node.data, label: newName } } : node
    )
  );
};
