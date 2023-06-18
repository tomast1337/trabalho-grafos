import { Graph } from "./graph";
import type { GNode } from "./node";

// Generate adjacency matrix from graph

export class AdjacencyMatrix<T> {
  private graph: Graph<T>;
  private matrix: number[][];

  constructor(graph: Graph<T>) {
    this.graph = graph;
    this.matrix = [];

    for (let i = 0; i < this.graph.getNodes().length; i++) {
      this.matrix[i] = [];

      for (let j = 0; j < this.graph.getNodes().length; j++) {
        this.matrix[i][j] = 0;
      }
    }

    const nodes = this.getSortedNodes();

    for (const edge of this.graph.getEdges()) {
      const { node1, node2, weight } = edge;

      const sourceIndex = nodes.indexOf(node1);
      const targetIndex = nodes.indexOf(node2);

      this.matrix[sourceIndex][targetIndex] = weight;
      this.matrix[targetIndex][sourceIndex] = weight;
    }
  }

  public getSortedNodes(): GNode<T>[] {
    // Return a list of nodes sorted alphabetically by data
    return this.graph.getNodes().sort((a, b) => {
      return a.data > b.data ? 1 : -1;
    });
  }

  public getMatrix(): number[][] {
    return this.matrix;
  }
}
