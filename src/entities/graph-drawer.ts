import rough from "roughjs";
import * as fs from "fs";
import { Graph } from "./graph";
import { GNode } from "./node";
import { DOMImplementation, XMLSerializer } from "xmldom";
import { RoughSVG } from "roughjs/bin/svg";
import { RandomSeed, create } from "random-seed";
import { Edge } from "./edge";

export class GraphDrawer<T> {
  private svgNode: SVGElement;
  private roughSVG: RoughSVG;
  private document: Document;
  private rand: RandomSeed;

  private nodeRadius: number = 20;
  private edgeColor: string = "#333333";
  private width: number;
  private height: number;

  private nodePositions: Map<T, [number, number]> = new Map();

  constructor(
    width: number = 800,
    height: number = 600,
    seed: string = "seed"
  ) {
    const document = new DOMImplementation().createDocument(
      "http://www.w3.org/1999/xhtml",
      "html",
      null
    );
    const svgNode = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgNode.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgNode.setAttribute("version", "1.1");
    svgNode.setAttribute("width", width.toString());
    svgNode.setAttribute("height", height.toString());
    svgNode.setAttribute("viewBox", `0 0 ${width} ${height}`);
    document.documentElement.appendChild(svgNode);

    this.rand = create(seed);
    this.document = document;
    this.roughSVG = rough.svg(svgNode);
    this.svgNode = svgNode;
    this.width = width;
    this.height = height;
  }

  private randomColor(): string {
    const r = Math.floor(this.rand(100)) + 155;
    const g = Math.floor(this.rand(100)) + 155;
    const b = Math.floor(this.rand(100)) + 155;

    return `rgb(${r},${g},${b})`;
  }

  private randomPosition(): [number, number] {
    const x = this.rand.floatBetween(
      this.nodeRadius * 4,
      this.width - this.nodeRadius * 4
    );
    const y = this.rand.floatBetween(
      this.nodeRadius * 4,
      this.height - this.nodeRadius * 4
    );
    // check if the position is already taken
    const taken = Array.from(this.nodePositions.values()).some(
      ([x2, y2]) =>
        Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2)) <
        this.nodeRadius * 4
    );
    if (taken) {
      return this.randomPosition();
    }
    return [x, y];
  }

  public drawGraph(graph: Graph<T>): GraphDrawer<T> {
    // draw nodes
    graph.getNodes().forEach((node) => {
      const [x, y] = this.randomPosition();
      this.nodePositions.set(node.data, [x, y]);
    });

    // draw edges
    graph.getEdges().forEach((edge) => {
      const [x1, y1] = this.nodePositions.get(edge.node1.data) || [
        undefined,
        undefined,
      ];
      const [x2, y2] = this.nodePositions.get(edge.node2.data) || [
        undefined,
        undefined,
      ];
      if (!x1 || !y1 || !x2 || !y2) {
        throw new Error("Node position not found");
      }
      this.drawEdges(edge, x1, y1, x2, y2);
    });

    // draw nodes
    graph.getNodes().forEach((node) => {
      const [x, y] = this.nodePositions.get(node.data) || [
        undefined,
        undefined,
      ];
      if (!x || !y) {
        throw new Error("Node position not found");
      }
      this.drawNode(node, x, y);
    });

    // draw a border
    const border = this.roughSVG.rectangle(
      this.nodeRadius * 2,
      this.nodeRadius * 2,
      this.width - this.nodeRadius * 4,
      this.height - this.nodeRadius * 4,
      {
        stroke: this.edgeColor,
        strokeWidth: 1,
        roughness: 5,
      }
    );
    this.svgNode.appendChild(border);

    return this;
  }

  private drawNode(node: GNode<T>, x: number, y: number) {
    // Draw node, a circle with text inside
    const circle = this.roughSVG.circle(x, y, this.nodeRadius * 2, {
      fill: this.randomColor(),
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 2,
      hachureAngle: 60,
    });
    this.svgNode.appendChild(circle);

    // draw text
    const elem = this.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    elem.setAttribute("x", x.toString());
    elem.setAttribute("y", y.toString());
    elem.setAttribute("text-anchor", "middle");
    elem.setAttribute("alignment-baseline", "middle");
    elem.setAttribute("font-size", "20px");
    elem.setAttribute("font-family", "sans-serif");
    elem.setAttribute("fill", "black");
    elem.textContent = node.data as string;
    this.svgNode.appendChild(elem);
  }

  private drawEdges(
    edge: Edge<T>,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    // Draw edges
    const line = this.roughSVG.line(x1, y1, x2, y2, {
      stroke: "black",
      strokeWidth: 2,
      roughness: 1,
    });
    this.svgNode.appendChild(line);
    const elemEd = this.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    elemEd.setAttribute("x", `${(x1 + x2) / 2}`);
    elemEd.setAttribute("y", `${(y1 + y2) / 2 + 15}`);
    elemEd.setAttribute("text-anchor", "middle");
    elemEd.setAttribute("alignment-baseline", "middle");
    elemEd.setAttribute("font-size", "20px");
    elemEd.setAttribute("font-family", "sans-serif");
    elemEd.setAttribute("fill", "black");
    elemEd.textContent = edge.weight.toString();
    this.svgNode.appendChild(elemEd);
  }

  public save(fileName: string) {
    // write to file
    fs.writeFileSync(fileName, this.getStringData());
  }
  public getStringData(): string {
    // write to string
    const xmlSerializer = new XMLSerializer();
    let xml = xmlSerializer.serializeToString(this.svgNode);
    return xml;
  }
}

export const example = () => {
  // Example usage
  const graph = new Graph<string>();
  const seed = process.cpuUsage().user;
  const rand = create(seed.toString());

  // Add nodes
  Array.from(Array(25).keys()).forEach((i) => {
    graph.addNode(rand(100).toString());
  });

  // Add edges
  Array.from(Array(20).keys()).forEach((i) => {
    try {
      const node = graph.getNodes()[i];
      const randNeighbor = graph.getNodes()[rand(graph.getNodes().length)];
      graph.addEdge(node.data, randNeighbor.data, rand.intBetween(1.0, 10.0));
    } catch (e) {
      // pass
    }
  });
  // Draw graph
  new GraphDrawer<string>().drawGraph(graph).save("graph.svg");
};
