import React from "react";
import { Handle, Position } from "reactflow";

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

export default CustomNode;
