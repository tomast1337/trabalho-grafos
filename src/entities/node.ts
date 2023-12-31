import { Edge } from "./edge";

export class GNode<T> {
  public data: T;
  public neighbors: Map<GNode<T>, number>;
  public color?: string;
  public position?: [number, number];
  public extras?: { [key: string]: string }; // for storing extra data
  constructor(data: T) {
    this.data = data;
    this.neighbors = new Map<GNode<T>, number>();
  }

  public addExtras(key: string, value: string) {
    if (!this.extras) {
        this.extras = {};
    }
    this.extras[key] = value;
    }

  public addNeighbor(neighbor: GNode<T>, weight = 1) {
    this.neighbors.set(neighbor, weight);
  }

  public getEdges(): Array<Edge<T>> {
    const edges = new Array<Edge<T>>();
    for (const neighbor of this.neighbors.keys()) {
      edges.push({
        node1: this,
        node2: neighbor,
        weight: this.neighbors.get(neighbor) || 0,
      });
    }
    return edges;
  }

  public removeNeighbor(neighbor: GNode<T>) {
    this.neighbors.delete(neighbor);
  }

  public getNeighbors() {
    return Array.from(this.neighbors.keys());
  }

  public getWeight(neighbor: GNode<T>) {
    return this.neighbors.get(neighbor);
  }
}
