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
  Handle,
  Position,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom Node Component
const CustomNode = ({ data }: { data: { label: string; onClick?: () => void } }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.stopPropagation();
        data.onClick?.();
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: "#555" }} />
      <Handle type="target" position={Position.Top} style={{ background: "#555" }} />
    </div>
  );
};


const initialNodes: Node[] = [
  {
    id: "start",
    type: "custom",
    data: {
      label: "Start Node",
      // onClick: () => {
      //   setSelectedNode({ id: "start", data: { label: "Start Node" }, type: "custom", position: { x: 250, y: 5 } });
      //   setNewLabel("Start Node");
      // }
    },
    position: { x: 250, y: 5 }
  },
  {
    id: "end",
    type: "custom",
    data: {
      label: "End Node",
      // onClick: () => {
      //   setSelectedNode({ id: "end", data: { label: "End Node" }, type: "custom", position: { x: 250, y: 300 } });
      //   setNewLabel("End Node");
      // }
    },
    position: { x: 250, y: 300 }
  },
];


const initialEdges: Edge[] = [
  { id: "start-end", source: "start", target: "end", animated: true },
];

const Workflow: React.FC = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [newLabel, setNewLabel] = useState<string>("");

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

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
  
      // Find the source and target nodes
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
      if (!sourceNode || !targetNode) return;
  
      // Calculate the midpoint position
      const newNodePosition = {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      };
  
      // Create a new action node
      const newNodeId = `action-${nodes.length}`;
      const newNode: Node = {
        id: newNodeId,
        type: "custom",
        data: {
          label: `Action Node ${nodes.length}`,
          onClick: () => {
            setSelectedNode(newNode);
            setNewLabel(`Action Node ${nodes.length}`);
          },
        },
        position: newNodePosition,
      };
  
      // Create new edges to connect the new node
      const newEdgeToAction: Edge = {
        id: `${edge.source}-${newNodeId}`,
        source: edge.source,
        target: newNodeId,
        animated: true,
      };
  
      const newEdgeFromAction: Edge = {
        id: `${newNodeId}-${edge.target}`,
        source: newNodeId,
        target: edge.target,
        animated: true,
      };
  
      // Update nodes and edges
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) =>
        eds
          .filter((e) => e.id !== edge.id) // Remove the clicked edge
          .concat(newEdgeToAction, newEdgeFromAction) // Add new edges
      );
    },
    [nodes] // Removed 'edges' from the dependency array
  );
  
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      if (node.type === "custom") {
        setSelectedNode(node);
        setNewLabel(node.data.label);
      }
    },
    []
  );

  const handleUpdateNode = () => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
      setSelectedNode(null);
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      // Find edges connected to the selected node
      const connectedEdges = edges.filter(
        (edge) =>
          edge.source === selectedNode.id || edge.target === selectedNode.id
      );
  
      // If there are exactly two connected edges, create a new edge between their other endpoints
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
          eds
            .filter(
              (edge) =>
                edge.source !== selectedNode.id && edge.target !== selectedNode.id
            )
            .concat(newEdge)
        );
      } else {
        setEdges((eds) =>
          eds.filter(
            (edge) =>
              edge.source !== selectedNode.id && edge.target !== selectedNode.id
          )
        );
      }
  
      // Remove the selected node
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            onNodeClick={onNodeClick}
            fitView
            nodeTypes={nodeTypes}
          />
        </div>
        {selectedNode && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
              onClick={() => setSelectedNode(null)}
            />

            {/* Modal */}
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                width: "400px",
                zIndex: 1000,
              }}
            >
              <h3 style={{ marginBottom: "16px", fontSize: "18px" }}>
                Update Node
              </h3>

              <label
                htmlFor="actionName"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "block",
                }}
              >
                Node Label
              </label>
              <input
                id="actionName"
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                style={{
                  marginTop: "8px",
                  marginBottom: "16px",
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={handleDeleteNode}
                  style={{
                    backgroundColor: "#fff",
                    color: "#d32f2f",
                    border: "1px solid #d32f2f",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>

                <div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#333",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateNode}
                    style={{
                      backgroundColor: "#7e22ce",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default Workflow;
