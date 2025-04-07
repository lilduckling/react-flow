import React, { useCallback, useState, useMemo } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./components/CustomNode";
import NodeModal from "./components/NodeModal"; // Import the NodeModal component
import { handleAddNodeOnEdge, handleDeleteNode, handleUpdateNode, onNodeClick } from "./handlers/nodeHandlers";
import { handleAddBranch, handleBranchNameChange } from "./handlers/branchNodeHandlers";
import { handleAddIfElseNode } from "./handlers/ifElseNodeHandlers";
import "./styles/WorkFlow.css";

const initialNodes: Node[] = [
  { id: "start", type: "custom", data: { label: "Start Node" }, position: { x: 250, y: 5 } },
  { id: "end", type: "custom", data: { label: "End Node" }, position: { x: 250, y: 300 } },
];

const initialEdges: Edge[] = [{ id: "start-end", source: "start", target: "end", animated: true }];

const Workflow: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [newLabel, setNewLabel] = useState<string>("");
  const [showEdgeMenu, setShowEdgeMenu] = useState<{
    edge: Edge | null;
    position: { x: number; y: number } | null;
  } | null>(null);
  const [branchNames, setBranchNames] = useState<{ [key: string]: string }>({});

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <ReactFlowProvider>
      <div className="workflow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={(event, edge) =>
            setShowEdgeMenu({ edge, position: { x: event.clientX, y: event.clientY } })
          }
          onNodeClick={(event, node) => onNodeClick(event, node, setSelectedNode, setNewLabel)}
          fitView
          nodeTypes={nodeTypes}
        />
        {showEdgeMenu?.edge && showEdgeMenu?.position && (
          <div className="edge-menu" style={{ top: showEdgeMenu.position.y, left: showEdgeMenu.position.x }}>
            <button
              className="edge-menu-button"
              onClick={() =>
                handleAddNodeOnEdge("action", showEdgeMenu, nodes, edges, setNodes, setEdges, setSelectedNode, setNewLabel)
              }
            >
              Action Node
            </button>
            <button
              className="edge-menu-button"
              onClick={() =>
                handleAddIfElseNode("ifElse", showEdgeMenu, nodes, edges, setNodes, setEdges, setSelectedNode, setBranchNames)
              }
            >
              If / Else Node
            </button>
          </div>
        )}
        <NodeModal
          selectedNode={selectedNode}
          newLabel={newLabel}
          setNewLabel={setNewLabel}
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          branchNames={branchNames}
          setBranchNames={setBranchNames}
          setSelectedNode={setSelectedNode}
          handleBranchNameChange={handleBranchNameChange}
          handleAddBranch={handleAddBranch}
          handleUpdateNode={(selectedNode, newLabel, nodes, setNodes, setSelectedNode) => {
            const updatedNodes = nodes.map((node) =>
              node.id === selectedNode?.id ? { ...node, data: { ...node.data, label: newLabel } } : node
            );
            setNodes(updatedNodes);
            setSelectedNode(null);
          }}
        />
        {selectedNode && !selectedNode.data.label.includes("If / Else Node") && (
          <div className="node-modal">
            <h3>Update Node</h3>
            <label htmlFor="nodeLabel">Node Label</label>
            <input
              id="nodeLabel"
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="node-modal-input"
            />
            <div className="modal-actions">
              <button
                className="modal-delete-button"
                onClick={() =>
                  handleDeleteNode(selectedNode, nodes, edges, setNodes, setEdges, setSelectedNode)
                }
              >
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
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default Workflow;
