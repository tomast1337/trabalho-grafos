import { Graph } from "./graph";

export class BFSSearch {
  private graph: Graph<string>;
  private endNode: string;
  private visited: Set<string>;
  private queue: string[];
  private path: string[];
  private searchTree: Graph<string>;

  constructor(graph: Graph<string>, endNode: string) {
    this.graph = graph;
    this.endNode = endNode;
    this.visited = new Set();
    this.queue = [];
    this.path = [];
    this.searchTree = new Graph<string>();
  }

  private BFS(): void {
    const startNode = this.graph.getNodes()[0].data;
    this.visited.add(startNode);
    this.queue.push(startNode);
    const startSearchNode = this.searchTree.addNode(startNode);
    startSearchNode.addExtras("depth", "0");
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
            const newNode = this.searchTree.addNode(neighbor);
            const currentDepth =
              this.searchTree.getNode(currentNode)?.extras?.depth || "0";
            newNode.addExtras("depth", `${parseInt(currentDepth) + 1}` || "0");
            this.searchTree.addEdge(currentNode, neighbor, 1);
          }
        }
      }
    }
  }

  public search(): [string[], Graph<string>] {
    this.BFS();
    return [this.path, this.searchTree];
  }

  public getSearchTree(): Graph<string> {
    return this.searchTree;
  }

  public printPath(): string {
    let output = "";
    output += `Path from ${this.graph.getNodes()[0].data} to ${
      this.endNode
    }:\n`;
    output += this.path.join(" -> ");
    return output;
  }

  public printSearchTree(): string {
    let output = "";
    output += `Search tree:\n`;
    output += this.searchTree.edgesString();
    return output;
  }

  public printAdjacencyList(): string {
    let output = "";
    output += `Adjacency list:\n`;
    output += this.searchTree.printAdjacencyList();
    return output;
  }

  public print(): string {
    return (
      this.printPath() +
      "\n\n" +
      this.printSearchTree() +
      "\n\n" +
      this.printAdjacencyList()
    );
  }
}
