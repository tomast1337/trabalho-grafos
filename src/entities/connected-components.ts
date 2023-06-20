import { Graph } from "./graph";
import { GNode } from "./node";

export class ConnectedComponents<T> {
  private graph: Graph<T>;

  constructor(graph: Graph<T>) {
    this.graph = graph;
  }

  public getConnectedComponents(): GNode<T>[][] {
    const visited: Map<T, boolean> = new Map<T, boolean>();
    const connectedComponents: GNode<T>[][] = [];

    for (const node of this.graph.getNodes()) {
      if (!visited.has(node.data)) {
        const component: GNode<T>[] = [];
        this.dfs(node, visited, component);
        connectedComponents.push(component);
      }
    }

    // Sort components by size
    connectedComponents.sort((a, b) => {
      return a.length > b.length ? -1 : 1;
    });

    return connectedComponents;
  }

  private dfs(node: GNode<T>, visited: Map<T, boolean>, component: GNode<T>[]) {
    visited.set(node.data, true);
    component.push(node);

    for (const neighbor of node.getNeighbors()) {
      if (!visited.has(neighbor.data)) {
        this.dfs(neighbor, visited, component);
      }
    }
  }

  public printConnectedComponents(): string {
    const components = this.getConnectedComponents();
    let output = "";
    output += `There are ${components.length} connected components in this graph.\n\n`;
    for (const component of components) {
      output += `Component ${components.indexOf(component) + 1}: [ `;
      output += component.map((node) => node.data).join(", ");
      output += " ]\n";
    }
    return output;
  }
}
