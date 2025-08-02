import { useState, useCallback } from 'react';
import { ReactFlow, addEdge, useNodesState, useEdgesState, Controls, Background, MiniMap } from '@xyflow/react';
import type { Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import components and data
import { AgentNode } from './components/AgentNode';
import { AddNodeButton } from './components/AddNodeButton';
import { NodeToolbar } from './components/NodeToolbar';
import { initialNodes, initialEdges } from './data/initialData';

const nodeTypes = {
  AgentNode: AgentNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
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

  const onNodeClick = useCallback((event: any, node: Node) => {
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

export default App;
