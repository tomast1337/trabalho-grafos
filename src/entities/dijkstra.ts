import { Graph } from "./graph";
import { GNode } from "./node";

export class Dijkstra<T> {
  private graph: Graph<T>;
  private distances: Map<T, number> = new Map<T, number>();
  private previous: Map<T, GNode<T> | null> = new Map<T, GNode<T> | null>();

  constructor(graph: Graph<T>) {
    this.graph = graph;
  }

  public findShortestPath(
    source: T,
    target: T
  ): { distance: number; path: T[] } {
    // Check if weights are non-negative
    if (!this.checkNonNegativeWeights()) {
      throw new Error("Graph contains negative weights.");
    }

    // Initialize data structures
    this.distances = new Map<T, number>();
    this.previous = new Map<T, GNode<T> | null>();
    const unvisited: Set<GNode<T>> = new Set<GNode<T>>();

    // Set initial distances and previous nodes
    for (const node of this.graph.getNodes()) {
      if (node.data === source) {
        this.distances.set(node.data, 0);
      } else {
        this.distances.set(node.data, Infinity);
      }
      this.previous.set(node.data, null);
      unvisited.add(node);
    }
    console.log(this.previous);
    console.log(this.distances);

    while (unvisited.size > 0) {
      // Find the node with the minimum distance
      const currentNode = this.getMinDistanceNode(unvisited);
      unvisited.delete(currentNode);

      // Check if we have reached the target node
      if (currentNode.data === target) {
        return this.buildPath(currentNode);
      }

      // Calculate the tentative distance for each neighbor
      for (const neighbor of currentNode.getNeighbors()) {
        const currentDistance =
          this.distances.get(currentNode.data) || Infinity;
        const edgeWeight = this.graph.getWeight(currentNode, neighbor);
        const neighborDistance = this.distances.get(neighbor.data) || Infinity;
        const tentativeDistance = currentDistance + edgeWeight;

        if (tentativeDistance < neighborDistance) {
          this.distances.set(neighbor.data, tentativeDistance);
          this.previous.set(neighbor.data, currentNode);
        }
      }
    }

    throw new Error("Path not found.");
  }

  public findShortestPathFromNode(
    source: T
  ): Map<T, { distance: number; path: T[] }> {
    const result = new Map<T, { distance: number; path: T[] }>();

    for (const node of this.graph.getNodes()) {
      try {
        const path = this.findShortestPath(source, node.data);
        result.set(node.data, path);
      } catch (e) {
        continue;
      }
    }

    return result;
  }

  private checkNonNegativeWeights(): boolean {
    const edges = this.graph.getEdges();

    for (const edge of edges) {
      if (edge.weight < 0) {
        return false;
      }
    }

    return true;
  }

  private getMinDistanceNode(nodes: Set<GNode<T>>): GNode<T> {
    let minNode: GNode<T> | null = null;
    let minDistance = Infinity;

    for (const node of nodes) {
      const distance = this.distances.get(node.data) || Infinity;
      console.log(distance + " " + node.data + " " + minDistance);
      if (distance < minDistance) {
        minNode = node;
        minDistance = distance;
      }
    }

    if (minNode === null) {
      throw new Error("Min distance node not found.");
    }

    return minNode;
  }

  private buildPath(targetNode: GNode<T>): { distance: number; path: T[] } {
    const path: T[] = [];
    let currentNode: GNode<T> | null = targetNode;

    while (currentNode !== null) {
      path.unshift(currentNode.data);
      currentNode = this.previous.get(currentNode.data);
    }

    const distance = this.distances.get(targetNode.data) || 0;

    return { distance, path };
  }
}
