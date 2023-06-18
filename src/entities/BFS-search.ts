import { Graph } from "./graph";

export class BFSSearch {
  private graph: Graph<string>;
  private endNode: string;
  private visited: Set<string>;
  private queue: Array<string>;
  private path: Array<string>;

  constructor(graph: Graph<string>, endNode: string) {
    this.graph = graph;
    this.endNode = endNode;
    this.visited = new Set();
    this.queue = [];
    this.path = [];
  }

  private BFS(): void {
    this.visited.add(this.graph.getNodes()[0].data);
    this.queue.push(this.graph.getNodes()[0].data);
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
