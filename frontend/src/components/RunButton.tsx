import type { Edge, Node } from '@xyflow/react';

async function runButtonHandle(nodes: Node[], edges: Edge[]) {
    const new_nodes = nodes.map((node) => node.data);

    const response = await fetch('/api/prompt', {
        method: 'POST', 
        body: JSON.stringify({nodes: nodes, edges: edges, prompt: ''})
    })
}


function RunButton({nodes, edges}: {nodes: Node[], edges: Edge[]}) {
    return (
        <div>
            <button
                onClick={() => runButtonHandle(nodes, edges)}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: 'rgb(0, 132, 255)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(2, 111, 212)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(0, 132, 255)';
                }}
            >
                Build + Run
            </button>
        </div>
    )
}

export default RunButton;