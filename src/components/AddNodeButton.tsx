interface AddNodeButtonProps {
  onClick: () => void;
}

export function AddNodeButton({ onClick }: AddNodeButtonProps) {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
      <button
        onClick={onClick}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#45a049';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#4CAF50';
        }}
      >
        Add Agent Node
      </button>
    </div>
  );
} 