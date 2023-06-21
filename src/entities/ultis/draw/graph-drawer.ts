import { RandomSeed, create } from "random-seed";
import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Graph } from "../../graph";
import { GNode } from "../../node";
import { FruchtermanReingold } from "./fruchterman-reingold";
import { getRandColor } from "../../../utils/color";
import { Edge } from "../../edge";

export class GraphDrawer {
  private graph: Graph<string>;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private rc: RoughCanvas;
  private random: RandomSeed;
  private radius = 15;
  private renderHandler: number | null = null;
  private simulation: FruchtermanReingold<string>;
  private isSearch: boolean;

  constructor(
    graph: Graph<string>,
    canvas: HTMLCanvasElement,
    seed = "seed",
    isSearch = false
  ) {
    this.graph = graph;
    this.canvas = canvas;
    this.rc = rough.canvas(this.canvas);
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.random = create(seed);
    this.isSearch = isSearch;
    for (const node of this.graph.getNodes()) {
      node.color = getRandColor(this.random);
    }
    for (const edge of graph.getEdges()) {
      edge.color = "black";
    }
    this.simulation = new FruchtermanReingold<string>(
      graph,
      canvas.width,
      canvas.height
    );
    this.simulation.layout();
  }
  private drawNodes(nodes: Array<GNode<string>>) {
    for (const node of nodes) {
      this.drawNode(node);
    }
  }

  private drawNode(node: GNode<string>) {
    const rc = this.rc;
    const context = this.context;
    const [x, y] = node.position || [0, 0];
    const color = node.color || "black";
    rc.circle(x, y, this.radius * 2, {
      roughness: 0.5,
      stroke: "black",
      fill: color,
      hachureAngle: this.random.intBetween(0, 360),
      hachureGap: this.random.intBetween(1, 5),
    });
    if (typeof node.data === "string") {
      context.font = "20px Arial";
      context.fillStyle = "black";
      const text = this.isSearch // if search tree, show depth of node beside the node data
        ? `${node.data.toString()} depth: ${node.extras?.depth || 0}`
        : node.data.toString();
      context.fillText(text, x - 5, y + 5);
    }
  }
  private drawEdges(edges: Array<Edge<string>>) {
    for (const edge of edges) {
      this.drawEdge(edge);
    }
  }

  private drawEdge(edge: Edge<string>) {
    const rc = this.rc;
    const context = this.context;
    const [x1, y1] = edge.node1.position || [0, 0];
    const [x2, y2] = edge.node2.position || [0, 0];
    const color = edge.color || "black";
    const weight = edge.weight || 1;
    rc.line(x1, y1, x2, y2, { stroke: color });
    const [dx, dy] = [x2 - x1, y2 - y1];
    const [d, theta] = [Math.sqrt(dx * dx + dy * dy), Math.atan2(dy, dx)];
    const [x, y] = [
      x1 + (Math.cos(theta) * d) / 2,
      y1 + (Math.sin(theta) * d) / 2,
    ];
    context.font = "20px Arial";
    context.fillStyle = "red";
    context.fillText(weight.toString(), x, y);
  }
  private draw() {
    const nodes = this.graph.getNodes();
    const edges = this.graph.getEdges();

    // clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw edges
    this.drawEdges(edges);
    // draw nodes
    this.drawNodes(nodes);
  }

  private updateNodesPosition() {
    this.simulation.updateNodesPosition();
  }

  public async start() {
    this.draw();
    for (let i = 0; i < 100; i++) {
      await this.renderLoop();
    }
  }

  public stop() {
    cancelAnimationFrame(this.renderHandler as number);
  }

  private async renderLoop() {
    this.updateNodesPosition();
    this.draw();
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  public setGraph(graph: Graph<string>) {
    this.graph = graph;
  }
}
