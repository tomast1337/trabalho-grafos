import { Edge } from "./edge";
import { Graph } from "./graph";
import { GNode } from "./node";

export class KruskalAlgorithm<T> {
  private find(parents: Map<GNode<T>, GNode<T>>, node: GNode<T>): GNode<T> {
    if (parents.get(node) === node) {
      return node;
    }
    return this.find(parents, parents.get(node)!);
  }

  private union(
    parents: Map<GNode<T>, GNode<T>>,
    node1: GNode<T>,
    node2: GNode<T>
  ): void {
    const root1 = this.find(parents, node1);
    const root2 = this.find(parents, node2);
    parents.set(root2, root1);
  }

  private getSortedEdges(graph: Graph<T>): Edge<T>[] {
    const edges: Edge<T>[] = [];

    for (const node of graph.getNodes()) {
      for (const neighbor of node.getNeighbors()) {
        const weight = node.getWeight(neighbor) || 0;
        edges.push({ node1: node, node2: neighbor, weight });
      }
    }

    edges.sort((a, b) => a.weight - b.weight);
    return edges;
  }

  public kruskalMST(graph: Graph<T>): Graph<T> {
    const result = new Graph<T>();
    const sortedEdges = this.getSortedEdges(graph);
    const parents = new Map<GNode<T>, GNode<T>>();

    for (const node of graph.getNodes()) {
      parents.set(node, node);
    }

    for (const edge of sortedEdges) {
      const root1 = this.find(parents, edge.node1);
      const root2 = this.find(parents, edge.node2);

      if (root1 !== root2) {
        result.addNode(edge.node1.data);
        result.addNode(edge.node2.data);
        result.addEdge(edge.node1.data, edge.node2.data, edge.weight);
        this.union(parents, root1, root2);
      }
    }

    return result;
  }
}
