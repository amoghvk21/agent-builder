import type { Edge, Node } from '@xyflow/react';
import { sortNodesSequentially } from '../utils/topologicalSort';

interface RunButtonProps {
  nodes: Node[];
  edges: Edge[];
  prompt: string;
  apiKey: string;
  onResponse: (response: string) => void;
}

async function runButtonHandle(
  nodes: Node[], 
  edges: Edge[], 
  prompt: string, 
  apiKey: string,
  onResponse: (response: string) => void
) {
  try {
    // Show loading state
    onResponse('Running...');
    
    // Sort nodes in sequential order based on edges
    const sortedNodes = sortNodesSequentially(nodes, edges);
    
    console.log(sortedNodes.map(node => ({
      agent_id: node.id,
      system_prompt: node.data.system_prompt || ''
    })));
    
    const response = await fetch('http://localhost:8000/api/prompt/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agents: sortedNodes.map(node => ({
          agent_id: node.id,
          system_prompt: node.data.system_prompt || ''
        })),
        main_prompt: prompt,
        api_key: apiKey
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    onResponse(result.result || 'No response received');
  } catch (error) {
    console.error('Error running flow:', error);
    onResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function RunButton({ nodes, edges, prompt, apiKey, onResponse }: RunButtonProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginBottom: '20px',
    }}>
      <button
        onClick={() => runButtonHandle(nodes, edges, prompt, apiKey, onResponse)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        Build + Run
      </button>
    </div>
  );
}

export default RunButton;