import { Graph } from "../../graph";
export class DFSSearch {
  private graph: Graph<string>;
  private endNode: string;
  private visited: Set<string>;
  private stack: Array<string>;
  private path: Array<string>;
  private searchTree: Graph<string>;
  constructor(graph: Graph<string>, endNode: string) {
    this.graph = graph;
    this.endNode = endNode;
    this.visited = new Set();
    this.stack = [];
    this.path = [];
    this.searchTree = new Graph<string>();

    this.stack.push(this.graph.getNodes()[0].data);
  }

  private DFSUtil(node: string, depth: string): void {
    this.visited.add(node);
    this.path.push(node);
    if (node === this.endNode) {
      return;
    }
    const neighbors = this.graph.getNeighbors(node);
    for (const neighbor of neighbors) {
      if (!this.visited.has(neighbor)) {
        const newNode = this.searchTree.addNode(neighbor);
        this.searchTree.addEdge(node, neighbor, 1);
        newNode.addExtras("depth", `${parseInt(depth) + 1}`);
        this.DFSUtil(neighbor, `${depth + 1}`);
      }
    }
  }

  private DFS(): void {
    const startNode = this.graph.getNodes()[0].data;
    this.stack.push(startNode);
    this.searchTree.addNode(startNode);
    const startSearchNode = this.searchTree.getNode(startNode);
    if (startSearchNode) {
      startSearchNode.addExtras("depth", "0");
    }

    while (this.stack.length > 0) {
      const currentNode = this.stack.pop();
      if (currentNode) {
        const currentDepth =
          this.searchTree.getNode(currentNode)?.extras?.depth || "0";
        this.DFSUtil(currentNode, currentDepth);
      }
    }
  }
  public search(): [string[], Graph<string>] {
    this.DFS();
    return [this.path, this.searchTree];
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
