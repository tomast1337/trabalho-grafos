import { Graph } from "./graph";

export class BFSSearch {
  private graph: Graph<string>;
  private startNode: string;
  private endNode: string;
  private visited: Set<string>;
  private queue: Array<string>;
  private path: Array<string>;

  constructor(graph: Graph<string>, startNode: string, endNode: string) {
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
    this.visited = new Set();
    this.queue = [];
    this.path = [];
    this.queue.push(startNode);
  }

  private BFS(): void {
    this.visited.add(this.startNode);
    while (this.queue.length > 0) {
      const currentNode = this.queue.shift();
      if (currentNode) {
        this.path.push(currentNode);
        if (currentNode === this.endNode) {
          return;
        }
        const neighbors = this.graph.getNeighbors(currentNode);
        for (const neighbor of neighbors) {
          if (!this.visited.has(neighbor)) {
            this.visited.add(neighbor);
            this.queue.push(neighbor);
          }
        }
      }
    }
  }

  public search(): string[] {
    this.BFS();
    return this.path;
  }
}
