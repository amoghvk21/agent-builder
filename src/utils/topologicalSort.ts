interface Node {
  id: string;
  [key: string]: any;
}

interface Edge {
  source: string;
  target: string;
  [key: string]: any;
}

/**
 * Sorts nodes in topological order based on their edges
 * @param nodes - Array of nodes with id field
 * @param edges - Array of edges with source and target fields
 * @returns Array of nodes in sequential order
 */
export function sortNodesSequentially(nodes: Node[], edges: Edge[]): Node[] {
  // Create adjacency list
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  // Initialize adjacency list and in-degree count
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  
  // Build adjacency list and calculate in-degrees
  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;
    
    if (adjacencyList.has(source)) {
      adjacencyList.get(source)!.push(target);
      inDegree.set(target, (inDegree.get(target) || 0) + 1);
    }
  });
  
  // Find nodes with no incoming edges (starting points)
  const queue: string[] = [];
  nodes.forEach(node => {
    if ((inDegree.get(node.id) || 0) === 0) {
      queue.push(node.id);
    }
  });
  
  const sortedNodes: Node[] = [];
  const visited = new Set<string>();
  
  // Process nodes in topological order
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    
    // Find the node object and add to sorted list
    const node = nodes.find(n => n.id === currentId);
    if (node) {
      sortedNodes.push(node);
    }
    
    // Process neighbors
    const neighbors = adjacencyList.get(currentId) || [];
    neighbors.forEach(neighborId => {
      const currentInDegree = inDegree.get(neighborId) || 0;
      inDegree.set(neighborId, currentInDegree - 1);
      
      if (currentInDegree - 1 === 0) {
        queue.push(neighborId);
      }
    });
  }
  
  // If we couldn't visit all nodes, there might be a cycle
  // In that case, add remaining nodes at the end
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      sortedNodes.push(node);
    }
  });
  
  return sortedNodes;
} 