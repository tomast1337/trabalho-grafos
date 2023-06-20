import { Graph } from "./graph";
import type { GNode } from "./node";

// Generate adjacency matrix from graph

export class MeanDistance<T> {
  private graph: Graph<T>;

  constructor(graph: Graph<T>) {
    this.graph = graph;
  }

  public getMeanDistance(allDistances?: { [key: string]: number[] }): number {
    const nodes = this.graph.getNodes();
    let sum = 0;
    let count = 0;
    for (const node of nodes) {
      // If allDistances is passed as an argument, use it
      let distances: number[];
      if (allDistances) {
        distances = allDistances[node.data as any];
      } else {
        distances = this.getDistances(node.data);
      }

      for (const distance of distances) {
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

      for (const neighbor of this.graph.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.set(neighbor, true);
          queue.push(neighbor);
          distances[neighbor as any] = currentDistance + 1;
        }
      }
    }

    // Remove null and 0 values resulting from the source node
    const filtered = distances.filter(
      (distance) => distance !== null && distance !== 0
    );
    return filtered;
  }

  public getAllDistances(): { [key: string]: number[] } {
    // Return an object with all distances from all nodes to all other nodes

    const distances: { [key: string]: number[] } = {};
    const nodes = this.graph.getNodes();
    for (const node of nodes) {
      distances[node.data as any] = this.getDistances(node.data);
    }
    return distances;
  }

  public printAllDistances(): string {
    // Return a string with the mean distance for the entire graph and
    // all distances from all nodes to all other nodes

    const distances = this.getAllDistances();

    // mean distance
    let output = `The mean distance between all nodes is ${this.getMeanDistance(
      distances
    ).toFixed(2)}\n\n`;

    // all distances
    for (const key in distances) {
      output += `${key}: [ ${distances[key].join(", ")} ]\n`;
    }

    return output;
  }
}
