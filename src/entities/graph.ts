import { GNode } from "./node";
import { Edge } from "./edge";
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

  public getMeanDistance(): number {
    // Mean of distance of all nodes (unordered) in the graph
    // If there's no path between two nodes, the pair isn't considered for the calculation

    const nodes = this.getNodes();
    let sum = 0;
    let count = 0;
    for (const node of nodes) {
      const distances = this.getDistances(node.data);
      for (const distance of distances) {
        console.log("DISTANCE: " + distance);
        if (distance === undefined || distance === Infinity) {
          continue;
        }
        sum += distance;
        count += 1;
      }
    }
    return sum / count;
  }

  public getDistances(source: T): number[] {
    // Return an array of distances from source to all other nodes
    // If there's no path between two nodes, the distance is Infinity

    const distances: number[] = [];
    const visited: Map<T, boolean> = new Map<T, boolean>();
    const queue: T[] = [];

    visited.set(source, true);
    queue.push(source);
    distances[source as any] = 0;

    while (queue.length > 0) {
      const current = queue.shift() as T;
      const currentDistance = distances[current as any];

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.set(neighbor, true);
          queue.push(neighbor);
          distances[neighbor as any] = currentDistance + 1;
          console.log(source + " " + (currentDistance + 1));
        }
      }
    }

    // Remove null and 0 values resulting from the source node
    const filtered = distances.filter(
      (distance) => distance !== null && distance !== 0
    );
    return filtered;
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
}
