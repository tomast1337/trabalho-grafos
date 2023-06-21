import { Graph } from "../../graph";


export class GraphLoader {
  public loadFromText(text: string): Graph<string> {
    try {
      const lines = text.split("\n");

      const graph = new Graph<string>();

      let node1: string;
      let node2: string;
      let weight: number;

      for (const line of lines) {
        const data = line.split(" ");
        if (data.length == 3) {
          const symbols = data.map((x: string) => x.trim()) as [
            string,
            string,
            string
          ];
          try {
            weight = parseFloat(symbols[2]);
          } catch (error) {
            throw new Error("Invalid line format");
          }
          node1 = symbols[0].toString();
          node2 = symbols[1].toString();
        } else if (data.length == 2) {
          [node1, node2] = data.map((x) => x.trim());
          weight = 1;
        } else if (data.length == 1) {
          const singleNode = data[0].trim();
          graph.addNode(singleNode);
          continue;
        } else {
          throw new Error("Invalid line format");
        }
        if (node1 && node2 && weight) {
          graph.addNode(node1);
          graph.addNode(node2);
          graph.addEdge(node1, node2, weight);
        }
      }
      return graph;
    } catch (error) {
      throw new Error(`Error loading graph from text: ${error}`);
    }
  }
}
