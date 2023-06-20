import { Graph } from "./graph";
import type { GNode } from "./node";

// Generate adjacency matrix from graph

export class MeanDistance<T> {
  private graph: Graph<T>;

  constructor(graph: Graph<T>) {
    this.graph = graph;
  }

  public getMeanDistance(): number {
    const nodes = this.graph.getNodes();
    let sum = 0;
    let count = 0;
    for (const node of nodes) {
      const distances = this.getDistances(node.data);
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
}
