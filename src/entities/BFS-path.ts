import { Graph } from "./graph";

export class BFSPath {
  private graph: Graph<string>;
  private startNode: string;
  private endNode: string;
  private visited: Set<string>;
  private queue: string[];
  private path: string[];
  private pathTree: Graph<string>;

  constructor(graph: Graph<string>, startNode: string, endNode: string) {
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
    this.visited = new Set();
    this.queue = [];
    this.path = [];
    this.pathTree = new Graph<string>();
  }

  private BFS(): void {
    this.visited.add(this.startNode);
    this.queue.push(this.startNode);
    const startSearchNode = this.pathTree.addNode(this.startNode);
    startSearchNode.addExtras("depth", "0");
    let foundEndNode = false; // Track if the end node is found
    while (this.queue.length > 0) {
      const currentNode = this.queue.shift();
      if (currentNode) {
        this.path.push(currentNode);
        if (currentNode === this.endNode) {
          foundEndNode = true;
          break; // Stop the traversal when the endNode is reached
        }
        const neighbors = this.graph.getNeighbors(currentNode);
        for (const neighbor of neighbors) {
          if (!this.visited.has(neighbor)) {
            this.visited.add(neighbor);
            this.queue.push(neighbor);
            const newNode = this.pathTree.addNode(neighbor);
            const currentDepth =
              this.pathTree.getNode(currentNode)?.extras?.depth || "0";
            newNode.addExtras("depth", `${parseInt(currentDepth) + 1}` || "0");
            this.pathTree.addEdge(currentNode, neighbor, 1);
          }
        }
      }
    }
    if (!foundEndNode) {
      this.path = []; // Empty the path if the endNode is not reached
    }
  }

  public findShortestPath(): [string[], Graph<string>] {
    this.BFS();
    return [this.path, this.pathTree];
  }
}
