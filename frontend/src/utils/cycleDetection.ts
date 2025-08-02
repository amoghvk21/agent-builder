import type { Node, Edge } from '@xyflow/react';

// Check if adding an edge would create a cycle
export function wouldCreateCycle(
  nodes: Node[],
  edges: Edge[],
  sourceId: string,
  targetId: string
): boolean {
  // Create a graph representation
  const graph = new Map<string, string[]>();
  
  // Initialize graph with all nodes
  nodes.forEach(node => {
    graph.set(node.id, []);
  });
  
  // Add existing edges to graph
  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;
    if (graph.has(source)) {
      graph.get(source)!.push(target);
    }
  });
  
  // Add the new edge to check
  if (graph.has(sourceId)) {
    graph.get(sourceId)!.push(targetId);
  }
  
  // Check for cycles using DFS
  const visited = new Set<string>();
  const recStack = new Set<string>();
  
  function hasCycle(nodeId: string): boolean {
    if (recStack.has(nodeId)) {
      return true; // Back edge found - cycle detected
    }
    
    if (visited.has(nodeId)) {
      return false; // Already processed
    }
    
    visited.add(nodeId);
    recStack.add(nodeId);
    
    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) {
        return true;
      }
    }
    
    recStack.delete(nodeId);
    return false;
  }
  
  // Check for cycles starting from each node
  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      if (hasCycle(nodeId)) {
        return true;
      }
    }
  }
  
  return false;
}

// Get all reachable nodes from a given node
export function getReachableNodes(
  nodes: Node[],
  edges: Edge[],
  startNodeId: string
): Set<string> {
  const graph = new Map<string, string[]>();
  
  // Initialize graph
  nodes.forEach(node => {
    graph.set(node.id, []);
  });
  
  // Add edges to graph
  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;
    if (graph.has(source)) {
      graph.get(source)!.push(target);
    }
  });
  
  const visited = new Set<string>();
  const queue = [startNodeId];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!visited.has(current)) {
      visited.add(current);
      const neighbors = graph.get(current) || [];
      queue.push(...neighbors);
    }
  }
  
  return visited;
} 