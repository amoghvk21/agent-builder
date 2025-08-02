import { useState, useCallback } from 'react';
import { ReactFlow, addEdge, useNodesState, useEdgesState, Controls, Background, MiniMap } from '@xyflow/react';
import type { Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import components and data
import { AgentNode } from './AgentNode';
import { AddNodeButton } from './AddNodeButton';
import { NodeToolbar } from './NodeToolbar';
import { initialNodes, initialEdges } from '../data/initialData';
import { wouldCreateCycle } from '../utils/cycleDetection';

const nodeTypes = {
  AgentNode: AgentNode,
};

function Edit() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showCycleWarning, setShowCycleWarning] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => {
      // Check if this connection would create a cycle
      if (params.source && params.target) {
        if (wouldCreateCycle(nodes, edges, params.source, params.target)) {
          setShowCycleWarning(true);
          // Hide warning after 3 seconds
          setTimeout(() => setShowCycleWarning(false), 3000);
          return; // Prevent the connection
        }
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, nodes, edges],
  );

  const addNode = useCallback(() => {
    const newNode = {
      id: nodeId.toString(),
      type: 'AgentNode',
      data: { 
        id: `agent-${nodeId.toString().padStart(3, '0')}`,
        agent_name: `Agent ${nodeId}`,
        system_prompt: `This is the system prompt for Agent ${nodeId}. You can customize this prompt to define the agent's behavior and capabilities.`
      },
      position: {
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((prev) => prev + 1);
  }, [nodeId, setNodes]);

  const onNodeClick = useCallback((_event: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: { agent_name?: string; system_prompt?: string }) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const closeToolbar = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <AddNodeButton onClick={addNode} />
      <NodeToolbar 
        selectedNode={selectedNode}
        onUpdateNode={updateNode}
        onClose={closeToolbar}
      />
      
      {/* Cycle Warning */}
      {showCycleWarning && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '8px',
          padding: '15px 20px',
          color: '#dc2626',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '300px',
        }}>
          ⚠️ Cannot create cycle in agent flow
        </div>
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Edit;
