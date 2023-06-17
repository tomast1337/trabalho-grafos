import * as fs from "fs";
import { Graph } from "./graph";

export class GraphLoader {
  public loadFromText(text: string): Graph<string> {
    try {
      const lines = text.split("\n");

      const graph = new Graph<string>();

      for (const line of lines) {
        const [node1, node2, weight] = line.split(" ");

        if (node1 && node2 && weight) {
          graph.addNode(node1);
          graph.addNode(node2);
          graph.addEdge(node1, node2, parseInt(weight));
        }
      }
      return graph;
    } catch (error) {
      throw new Error(`Error loading graph from text: ${error}`);
    }
  }
  public loadFromFile(filePath: string): Graph<string> {
    try {
      const text = fs.readFileSync(filePath, "utf8");
      return this.loadFromText(text);
    } catch (error) {
      throw new Error(`Error loading file ${filePath}: ${error}`);
    }
  }
}

export const example = () => {
  const graphLoader = new GraphLoader();

  const loadedGraph = graphLoader.loadFromText(`
        A B 4
        A C 1
        B C 3
        B D 2
    `);

  if (loadedGraph) {
    // Use the loaded graph as needed
    console.log("Loaded graph:", loadedGraph);
  }
};
