import { Graph } from "./graph";
export class DFSSearch {
  private graph: Graph<string>;
  private endNode: string;
  private visited: Set<string>;
  private stack: Array<string>;
  private path: Array<string>;
  constructor(graph: Graph<string>, endNode: string) {
    this.graph = graph;
    this.endNode = endNode;
    this.visited = new Set();
    this.stack = [];
    this.path = [];
    this.stack.push(this.graph.getNodes()[0].data);
  }

  private DFSUtil(node: string): void {
    this.visited.add(node);
    this.path.push(node);
    if (node === this.endNode) {
      return;
    }
    const neighbors = this.graph.getNeighbors(node);
    for (const neighbor of neighbors) {
      if (!this.visited.has(neighbor)) {
        this.DFSUtil(neighbor);
      }
    }
  }

  private DFS(): void {
    while (this.stack.length > 0) {
      const currentNode = this.stack.pop();
      if (currentNode) {
        this.DFSUtil(currentNode);
      }
    }
  }

  public search(): string[] {
    this.DFS();
    return this.path;
  }
}
