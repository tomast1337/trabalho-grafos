import { Edge } from "./edge";
import { GNode } from "./node";
export class Graph<T> {
  nodes: Map<T, GNode<T>>;

  constructor() {
    this.nodes = new Map<T, GNode<T>>();
  }

  public addNode(data: T): GNode<T> {
    // check if node already exists
    if (this.nodes.has(data)) {
      return this.nodes.get(data) as GNode<T>;
    }
    const newNode = new GNode<T>(data);
    this.nodes.set(data, newNode);
    return newNode;
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

  public getEdges(): Edge<T>[] {
    const edges: Set<Edge<T>> = new Set<Edge<T>>();

    for (const node of this.nodes.values()) {
      for (const neighbor of node.getNeighbors()) {
        // make node 1 the smaller node
        if (node.data > neighbor.data) {
          continue;
        }
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

  public getAdjacencyList(): { [key: string]: string[] } {
    const adjacencyList: { [key: string]: string[] } = {};

    for (const node of this.nodes.values()) {
      adjacencyList[node.data.toString()] = node
        .getNeighbors()
        .map((node) => node.data.toString());
    }

    return adjacencyList;
  }

  public printAdjacencyList(): string {
    const adjacencyList = this.getAdjacencyList();
    let output = "";

    for (const key in adjacencyList) {
      output += `${key}: [ ${adjacencyList[key].join(", ")} ]\n`;
    }

    return output;
  }

  public getAllUnconnectedNodes(): GNode<T>[] {
    return this.getNodes().filter((node) => node.getNeighbors().length === 0);
  }

  public save(): string {
    let nodesString = "";

    nodesString += `# n = ${this.getNodes().length}\n`; // number of nodes
    nodesString += `# m = ${this.getEdges().length}\n`; // number of edges
    nodesString += `# d_medio = ${this.getMeanDegree()}\n`; // mean degree
    nodesString += "\n";

    // degree distribution
    nodesString += "# distribuição do grau dos vértices: \n";
    const distribution = this.getDegreeDistribution();
    for (const degree in distribution) {
      nodesString += `# grau ${degree} = ${distribution[degree]}\n`;
    }

    const edges = this.edgesString();
    // get all unconected nodes
    const nodes = this.getAllUnconnectedNodes();

    nodesString += nodes.map((node) => node.data).join("\n");
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

  public getDegree(currentNode: T) {
    const node = this.getNode(currentNode);
    if (node) {
      return node.getNeighbors().length;
    } else {
      return 0;
    }
  }

  public getMeanDegree() {
    const nodes = this.getNodes();
    const sum = nodes.reduce(
      (acc, node) => acc + node.getNeighbors().length,
      0
    );
    return sum / nodes.length;
  }

  public getDegreeDistribution() {
    const nodes = this.getNodes();
    const distribution: { [key: string]: number } = {};

    for (const node of nodes) {
      const degree = node.getNeighbors().length;
      if (distribution[degree]) {
        distribution[degree] += 1;
      } else {
        distribution[degree] = 1;
      }
    }

    return distribution;
  }

  public areWeightsEqual() {
    const weights = this.getEdges().map((edge) => edge.weight);
    // check if all weights are equal
    const result = weights.every((val, _, arr) => val === arr[0]);
    return result;
  }
}
