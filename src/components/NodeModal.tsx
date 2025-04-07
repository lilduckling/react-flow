import React from "react";
import { Edge, Node } from "reactflow";

interface NodeModalProps {
  selectedNode: Node | null;
  newLabel: string;
  setNewLabel: React.Dispatch<React.SetStateAction<string>>;
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  branchNames: { [key: string]: string };
  setBranchNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  handleBranchNameChange: (
    branchId: string,
    value: string,
    nodes: Node[],
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    branchNames: { [key: string]: string },
    setBranchNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  ) => void;
  handleAddBranch: (
    selectedNode: Node | null,
    nodes: Node[],
    edges: Edge[],
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    branchNames: { [key: string]: string },
    setBranchNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>,
    setNewLabel: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  handleUpdateNode: (
    selectedNode: Node | null,
    newLabel: string,
    nodes: Node[],
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>
  ) => void;
}

const NodeModal: React.FC<NodeModalProps> = ({
  selectedNode,
  newLabel,
  setNewLabel,
  nodes,
  edges,
  setNodes,
  setEdges,
  branchNames,
  setBranchNames,
  setSelectedNode,
  handleBranchNameChange,
  handleAddBranch,
  handleUpdateNode,
}) => {
  if (!selectedNode || !selectedNode.data.label.includes("If / Else Node")) return null;

  const handleDelete = () => {
    const relatedNodes = edges
      .filter((edge) => edge.source === selectedNode.id)
      .map((edge) => edge.target);

    const additionalNodes = edges
      .filter((edge) => relatedNodes.includes(edge.source))
      .map((edge) => edge.target);

    const allNodesToDelete = [...relatedNodes, ...additionalNodes];

    const nodesToDelete = allNodesToDelete.filter((nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      return node && node.data.label !== "End Node";
    });

    setNodes((nds) =>
      nds.filter((node) => node.id !== selectedNode.id && !nodesToDelete.includes(node.id))
    );
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id &&
          !nodesToDelete.includes(edge.source) &&
          !nodesToDelete.includes(edge.target)
      )
    );
    setBranchNames((prev) => {
      const updated = { ...prev };
      nodesToDelete.forEach((nodeId) => delete updated[nodeId]);
      return updated;
    });
    setSelectedNode(null);
  };

  return (
    <div className="node-modal">
      <h3>Action</h3>
      <label htmlFor="ifElseName">Action Name</label>
      <input
        id="ifElseName"
        type="text"
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
        className="node-modal-input"
      />
      <h4>Branches</h4>
      {Object.entries(branchNames)
        .filter(
          ([branchId]) =>
            edges.some((edge) => edge.source === selectedNode.id && edge.target === branchId) &&
            !branchId.includes("else")
        )
        .map(([branchId, branchName]) => (
          <div key={branchId} className="branch-row">
            <input
              type="text"
              value={branchName}
              onChange={(e) =>
                handleBranchNameChange(branchId, e.target.value, nodes, setNodes, branchNames, setBranchNames)
              }
              className="branch-input"
            />
            <button
              className="branch-delete-button"
              onClick={() => {
                setNodes((nds) => nds.filter((node) => node.id !== branchId));
                setEdges((eds) => eds.filter((edge) => edge.target !== branchId));
                setBranchNames((prev) => {
                  const updated = { ...prev };
                  delete updated[branchId];
                  return updated;
                });
              }}
            >
              X
            </button>
          </div>
        ))}
      <button
        className="add-branch-button"
        onClick={() =>
          handleAddBranch(
            selectedNode,
            nodes,
            edges,
            setNodes,
            setEdges,
            branchNames,
            setBranchNames,
            setSelectedNode,
            setNewLabel
          )
        }
      >
        + Add Branch
      </button>
      <h4>Else</h4>
      {Object.entries(branchNames)
        .filter(([branchId]) => branchId.includes("else"))
        .map(([elseNodeId, elseNodeName]) => (
          <div key={elseNodeId} className="branch-row">
            <input
              type="text"
              value={elseNodeName}
              onChange={(e) =>
                handleBranchNameChange(elseNodeId, e.target.value, nodes, setNodes, branchNames, setBranchNames)
              }
              className="else-input"
            />
          </div>
        ))}
      <div className="modal-actions">
        <button className="modal-delete-button" onClick={handleDelete}>
          Delete
        </button>
        <button className="modal-cancel-button" onClick={() => setSelectedNode(null)}>
          Cancel
        </button>
        <button
          className="modal-save-button"
          onClick={() => handleUpdateNode(selectedNode, newLabel, nodes, setNodes, setSelectedNode)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NodeModal;
