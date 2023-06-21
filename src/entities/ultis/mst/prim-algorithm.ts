import { Graph } from "../../graph";
import { GNode } from "../../node";

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
