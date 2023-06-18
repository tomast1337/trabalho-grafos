import { Graph } from "./graph";
export class DFSSearch {
  private graph: Graph<string>;
  private startNode: string;
  private endNode: string;
  private visited: Set<string>;
  private stack: Array<string>;
  private path: Array<string>;
  constructor(graph: Graph<string>, startNode: string, endNode: string) {
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
    this.visited = new Set();
    this.stack = [];
    this.path = [];
    this.stack.push(startNode);
  }

  private DFS(): void {
    const currentNode = this.graph.getNode(this.startNode);
    if (currentNode) {
      this.visited.add(currentNode.data);
      this.path.push(currentNode.data);
      if (currentNode.data === this.endNode) {
        return;
      }
      const neighbors = this.graph.getNeighbors(currentNode.data);
      for (const neighbor of neighbors) {
        if (!this.visited.has(neighbor)) {
          this.stack.push(neighbor);
        }
      }
      this.DFS();
    }
  }

  public search(): string[] {
    this.DFS();
    return this.path;
  }
}
