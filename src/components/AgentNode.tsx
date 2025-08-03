import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';


export function AgentNode({ data }: NodeProps) {
  return (
    <div style={{
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      minWidth: '200px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          {(data as any).agent_name}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
          overflow: 'auto',
          maxHeight: '500px',
          maxWidth: '500px', 
          boxSizing: 'border-box'
        }}>
          <strong>System Prompt:</strong><br />
          {(data as any).system_prompt}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
} 