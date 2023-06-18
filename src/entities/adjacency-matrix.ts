import { Graph } from "./graph";

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

    for (const edge of this.graph.getEdges()) {
      const { node1, node2, weight } = edge;

      const sourceIndex = this.graph.getNodes().indexOf(node1);
      const targetIndex = this.graph.getNodes().indexOf(node2);

      this.matrix[sourceIndex][targetIndex] = weight;
      this.matrix[targetIndex][sourceIndex] = weight;
    }
  }

  public getMatrix(): number[][] {
    return this.matrix;
  }
}
