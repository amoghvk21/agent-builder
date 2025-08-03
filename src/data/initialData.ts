import type { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'AgentNode',
    data: { 
      id: 'agent-001',
      agent_name: 'Assistant Agent',
      system_prompt: 'You are a helpful AI assistant that responds to user queries in a clear and concise manner.'
    },
    position: { x: 350, y: 350 },
  },
];

export const initialEdges: Edge[] = []; 