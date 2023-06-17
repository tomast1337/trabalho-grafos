import { Edge } from "./edge";
import { Graph } from "./graph";
import { GNode } from "./node";

export class PrimAlgorithm<T> {
  public primMST(graph: Graph<T>): Graph<T> {
    const result = new Graph<T>();
    const visited = new Set<GNode<T>>();

    // add all vertices to the new graph
    for (const node of graph.getNodes()) {
        result.addNode(node.data);
    }

    // Check if the graph is empty
    if (graph.getNodes().length === 0) {
      return result;
    }

    // Pick a starting node
    const startNode = graph.getNodes()[0];
    visited.add(startNode);

    while (visited.size < graph.getNodes().length) {
      let minimum = Infinity;
      let nodeA: GNode<T> | null = null;
      let nodeB: GNode<T> | null = null;
      for (const node of visited) {
        const neighbors = node.getNeighbors();
        for (const neighbor of neighbors) {
          if (visited.has(neighbor)) {
            continue;
          }
          const weight = node.getWeight(neighbor);
          if (weight && weight < minimum) {
            minimum = weight;
            nodeA = node;
            nodeB = neighbor;
          }
        }
      }
      if (nodeA && nodeB) {
        result.addEdge(nodeA.data, nodeB.data, minimum);
        visited.add(nodeB);
      }
    }

    return result;
  }
}

export const example = () => {
  // Example usage
  const graph = new Graph<string>();

  // Add nodes
  graph.addNode("A");
  graph.addNode("B");
  graph.addNode("C");
  graph.addNode("D");
  graph.addNode("E");

  // Add weighted edges
  graph.addEdge("A", "B", 4);
  graph.addEdge("A", "C", 1);
  graph.addEdge("B", "C", 3);
  graph.addEdge("B", "D", 2);
  graph.addEdge("D", "E", 3);
  graph.addEdge("C", "D", 4);
  graph.addEdge("C", "E", 2);

  const prim = new PrimAlgorithm<string>();
  const minimumSpanningTree = prim.primMST(graph);

  // Print the minimum spanning tree
  console.log("Minimum Spanning Tree:");
  for (const node of minimumSpanningTree.getNodes()) {
    const neighbors = node.getNeighbors();
    for (const neighbor of neighbors) {
      const weight = node.getWeight(neighbor);
      console.log(`${node.data} -- ${weight} -- ${neighbor.data}`);
    }
  }
};
