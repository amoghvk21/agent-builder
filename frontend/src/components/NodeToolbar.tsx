import { useState, useEffect } from 'react';

interface NodeToolbarProps {
  selectedNode: any;
  onUpdateNode: (nodeId: string, updates: { agent_name?: string; system_prompt?: string }) => void;
  onClose: () => void;
}

export function NodeToolbar({ selectedNode, onUpdateNode, onClose }: NodeToolbarProps) {
  const [agentName, setAgentName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setAgentName(selectedNode.data.agent_name || '');
      setSystemPrompt(selectedNode.data.system_prompt || '');
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        agent_name: agentName,
        system_prompt: systemPrompt,
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (selectedNode) {
      setAgentName(selectedNode.data.agent_name || '');
      setSystemPrompt(selectedNode.data.system_prompt || '');
    }
    onClose();
  };

  if (!selectedNode) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '60px',
      left: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      minWidth: '400px',
      maxWidth: '500px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '10px',
      }}>
        <h3 style={{ margin: 0, color: '#1f2937' }}>Edit Agent Node</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#374151',
        }}>
          Agent Name:
        </label>
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
          placeholder="Enter agent name"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#374151',
        }}>
          System Prompt:
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'Arial, sans-serif',
            boxSizing: 'border-box'
          }}
          placeholder="Enter system prompt"
        />
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
} 