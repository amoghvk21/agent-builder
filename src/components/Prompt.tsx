import { useState } from 'react';
import RunButton from './RunButton';

interface PromptProps {
  nodes: any[];
  edges: any[];
}

export function Prompt({ nodes, edges }: PromptProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      minWidth: '400px',
      maxWidth: '500px',
      maxHeight: 'calc(100vh - 40px)',
      overflow: 'auto',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '10px',
      }}>
        <h3 style={{ margin: 0, color: '#1f2937' }}>Prompt & Response</h3>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#374151',
        }}>
          OpenAI API Key:
        </label>
        <input 
          type='password' 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#6b7280',
            overflow: 'auto',
            boxSizing: 'border-box',
            marginBottom: '20px'
          }}
          placeholder='Enter API key'
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#374151',
        }}>
          Input Prompt:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
          placeholder="Enter your prompt here..."
        />
      </div>

      <RunButton 
        nodes={nodes} 
        edges={edges} 
        prompt={prompt}
        apiKey={apiKey}
        onResponse={setResponse}
      />

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#374151',
        }}>
          Response:
        </label>
        <div style={{
          width: '100%',
          minHeight: '150px',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f9fafb',
          color: '#6b7280',
          overflow: 'auto',
          boxSizing: 'border-box'
        }}>
          {response || 'Response will appear here when you run the flow...'}
        </div>
      </div>
    </div>
  );
} 