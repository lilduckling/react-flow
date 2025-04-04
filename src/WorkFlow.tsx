import React, { useCallback } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";

// Custom Node Component
const CustomNode = ({ data }: { data: { label: string } }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
    </div>
  );
};

const initialNodes: Node[] = [
  { id: "start", type: "custom", data: { label: "Start Node" }, position: { x: 250, y: 5 } },
  { id: "end", type: "custom", data: { label: "END" }, position: { x: 250, y: 300 } },
];

const initialEdges: Edge[] = [];

const Workflow: React.FC = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

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

  const addConnection = () => {
    const newEdge: Edge = { id: "start-end", source: "start", target: "end", animated: true };
    setEdges((eds) => [...eds, newEdge]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <button
        onClick={addConnection}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          padding: "8px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Connection
      </button>
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
          fitView
          nodeTypes={{ custom: CustomNode }}
        />
      </div>
    </div>
  );
};

export default Workflow;
