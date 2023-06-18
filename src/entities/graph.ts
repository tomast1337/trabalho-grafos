import { GNode } from "./node";
import { Edge } from "./edge";
export class Graph<T> {
  nodes: Map<T, GNode<T>>;

  constructor() {
    this.nodes = new Map<T, GNode<T>>();
  }

  public addNode(data: T) {
    // check if node already exists
    if (this.nodes.has(data)) {
      return;
    }
    const newNode = new GNode<T>(data);
    this.nodes.set(data, newNode);
  }

  public addGNode(node: GNode<T>) {
    this.nodes.set(node.data, node);
  }

  public removeNode(data: T) {
    const nodeToRemove = this.nodes.get(data);
    if (nodeToRemove) {
      this.nodes.delete(data);

      // Remove the node from its neighbors' adjacency lists
      for (const node of this.nodes.values()) {
        node.removeNeighbor(nodeToRemove);
      }
    }
  }

  public addEdge(data1: T, data2: T, weight = 1) {
    const node1 = this.nodes.get(data1);
    const node2 = this.nodes.get(data2);

    if (node1 && node2) {
      node1.addNeighbor(node2, weight);
      node2.addNeighbor(node1, weight);
    }
  }

  public removeEdge(data1: T, data2: T) {
    const node1 = this.nodes.get(data1);
    const node2 = this.nodes.get(data2);

    if (node1 && node2) {
      node1.removeNeighbor(node2);
      node2.removeNeighbor(node1);
    }
  }

  public getNode(data: T) {
    return this.nodes.get(data);
  }

  public getNodes() {
    return Array.from(this.nodes.values());
  }

  public getMeanDistance(): number {
    const edges = this.getEdges();
    const sum = edges.reduce((acc, edge) => acc + edge.weight, 0);
    return sum / edges.length;
  }

  public getEdges(): Edge<T>[] {
    const edges: Set<Edge<T>> = new Set<Edge<T>>();

    for (const node of this.nodes.values()) {
      for (const neighbor of node.getNeighbors()) {
        edges.add({
          node1: node,
          node2: neighbor,
          weight: node.getWeight(neighbor) || 0,
        });
      }
    }
    const list = Array.from(edges);
    return list;
  }

  public edgesString(): string {
    return this.getEdges()
      .map((edge) => `${edge.node1.data} ${edge.node2.data} ${edge.weight}`)
      .join("\n");
  }

  public getAllUnconnectedNodes(): GNode<T>[] {
    return this.getNodes().filter((node) => node.getNeighbors().length === 0);
  }

  public save(): string {
    const edges = this.edgesString();
    // get all unconected nodes
    const nodes = this.getAllUnconnectedNodes();
    const nodesString = nodes.map((node) => node.data).join("\n");
    return `${nodesString}\n${edges}`;
  }

  public getWeight(node: GNode<T>, otherNode: GNode<T>): number {
    return node.getWeight(otherNode) || 0;
  }

  public getNeighbors(currentNode: T) {
    const node = this.getNode(currentNode);
    if (node) {
      return node.getNeighbors().map((neighbor) => neighbor.data);
    } else {
      return [];
    }
  }
}
