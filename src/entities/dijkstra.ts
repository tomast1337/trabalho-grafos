import { Graph } from "./graph";
import { GNode } from "./node";

export class Dijkstra {
  private graph: Graph<string>;
  private distances: Map<string, number> = new Map<string, number>();
  private previous: Map<string, GNode<string> | null> = new Map<
    string,
    GNode<string> | null
  >();
  private startNode: string;
  private endNode: string;

  constructor(graph: Graph<string>, startNode: string, endNode: string) {
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
  }

  private initialize(): void {
    for (const node of this.graph.getNodes()) {
      this.distances.set(node.data, Infinity);
      this.previous.set(node.data, null);
    }
    this.distances.set(this.startNode, 0);
  }

  private getSmallestNode(unvisited: Set<string>): string | null {
    let smallestNode: string | null = null;
    for (const node of unvisited) {
      if (
        !smallestNode ||
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.distances.get(node)! < this.distances.get(smallestNode)!
      ) {
        smallestNode = node;
      }
    }
    return smallestNode;
  }

  private relaxNeighbors(node: GNode<string>): void {
    const neighbors = this.graph.getNeighbors(node.data);
    for (const neighbor of neighbors) {
        const a = this.distances.get(node.data) || 0
        const neighborNode = this.graph.getNode(neighbor) || new GNode<string>('')
        const b = node.getWeight(neighborNode) || 0
        const distance = a + b;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (distance < this.distances.get(neighbor)! || 0) {
        this.distances.set(neighbor, distance);
        this.previous.set(neighbor, node);
      }
    }
  }

  public findShortestPath(): [string[], Graph<string>] {
    this.initialize();
    const unvisited = new Set<string>(
      this.graph.getNodes().map((node) => node.data)
    );

    while (unvisited.size > 0) {
      const smallestNode = this.getSmallestNode(unvisited);
      if (!smallestNode || smallestNode === this.endNode) {
        break;
      }
      unvisited.delete(smallestNode);
      const node = this.graph.getNode(smallestNode);
      if (node) {
        this.relaxNeighbors(node);
      }
    }

    const path: string[] = [];
    let currentNode = this.endNode;
    while (currentNode !== this.startNode) {
      path.unshift(currentNode);
      currentNode = this.previous.get(currentNode)?.data || "";
    }
    path.unshift(this.startNode);

    const pathTree = new Graph<string>();
    for (const node of this.graph.getNodes()) {
      pathTree.addNode(node.data);
    }
    for (const [node, prev] of this.previous) {
      if (prev) {
        // get the node form the graph
        const g_node = this.graph.getNode(node);
        const weight = g_node?.getWeight(prev) || 0;
        pathTree.addEdge(prev.data, node, weight);
      }
    }

    return [path, pathTree];
  }
}
