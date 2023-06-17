import rough from "roughjs";
import { Graph } from "./graph";
import { GNode } from "./node";
import { RoughSVG } from "roughjs/bin/svg";
import { RandomSeed, create } from "random-seed";
import { Edge } from "./edge";
import { RoughCanvas } from "roughjs/bin/canvas";
import { getRandColor } from "../utils/color";

export class GraphDrawer<T> {
  private graph: Graph<T>;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private rc: RoughCanvas;
  private random: RandomSeed;
  private radius = 15;
  private renderHandler: number | null = null;

  constructor(graph: Graph<T>, canvas: HTMLCanvasElement, seed = "seed") {
    this.graph = graph;
    this.canvas = canvas;
    this.rc = rough.canvas(this.canvas);
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.random = create(seed);
    for (const node of this.graph.getNodes()) {
      node.position = [
        250, //this.random.intBetween(this.radius * 2, 500 - this.radius * 2),
        250, //this.random.intBetween(this.radius * 2, 500 - this.radius * 2),
      ];

      node.color = getRandColor(this.random);
    }
    for (const edge of graph.getEdges()) {
      edge.color = "black";
    }
  }
  private drawNodes(nodes: Array<GNode<T>>) {
    for (const node of nodes) {
      this.drawNode(node);
    }
  }

  private drawNode(node: GNode<T>) {
    const rc = this.rc;
    const context = this.context;
    const [x, y] = node.position || [0, 0];
    const color = node.color || "black";
    rc.circle(x, y, this.radius * 2, {
      roughness: 0.5,
      stroke: "black",
      fill: color,
      hachureAngle: this.random.intBetween(0, 360),
      hachureGap: this.random.intBetween(0, 1),
    });
    if (typeof node.data === "string") {
      context.font = "20px Arial";
      context.fillStyle = "black";
      context.fillText(node.data.toString(), x - 5, y + 5);
    }
  }
  private drawEdges(edges: Array<Edge<T>>) {
    for (const edge of edges) {
      this.drawEdge(edge);
    }
  }

  private drawEdge(edge: Edge<T>) {
    const rc = this.rc;
    const context = this.context;
    const [x1, y1] = edge.node1.position || [0, 0];
    const [x2, y2] = edge.node2.position || [0, 0];
    const color = edge.color || "black";
    const weight = edge.weight || 1;
    rc.line(x1, y1, x2, y2, { roughness: 2, stroke: color });
    const [dx, dy] = [x2 - x1, y2 - y1];
    const [d, theta] = [Math.sqrt(dx * dx + dy * dy), Math.atan2(dy, dx)];
    const [x, y] = [
      x1 + (Math.cos(theta) * d) / 2 + this.random.intBetween(-1, 1),
      y1 + (Math.sin(theta) * d) / 2 + this.random.intBetween(-1, 1),
    ];
    context.font = "20px Arial";
    context.fillStyle = "black";
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
    const newPositions: [number, number][] = [];
    const k = 5; // Repulsion factor
    const c = 10; // Attraction factor
    const threshold = this.radius * 4; // minimum distance between nodes
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    for (const node of this.graph.getNodes()) {
      const neighbors = node.getNeighbors();
      const neighborsPosition = neighbors.map(
        (neighbor) => neighbor.position || [0, 0]
      );

      const [x, y] = node.position || [0, 0];
      let [dx, dy] = [0, 0];

      // Apply repulsion force from other nodes
      for (const otherNode of this.graph.getNodes()) {
        if (otherNode !== node) {
          const [nx, ny] = otherNode.position || [0, 0];
          const distance = Math.max(
            this.radius * 4,
            Math.sqrt((nx - x) ** 2 + (ny - y) ** 2)
          );
          const force = k / distance;
          dx += ((x - nx) / distance) * (force * 1000);
          dy += ((y - ny) / distance) * (force * 1000);
        }
      }

      // Apply attraction force towards neighbors
      for (const [nx, ny] of neighborsPosition) {
        const distance = Math.max(
          this.radius,
          Math.sqrt((nx - x) ** 2 + (ny - y) ** 2)
        );
        const force = c * distance;
        if (distance < threshold) {
          dx += ((nx - x) / distance) * force;
          dy += ((ny - y) / distance) * force;
        }
      }
      // apply repulsion force from canvas border
      const distanceFromBorder = Math.min(
        x,
        y,
        canvasWidth - x,
        canvasHeight - y
      );
      const force = k / distanceFromBorder;
      dx += ((x - canvasWidth / 2) / distanceFromBorder) * force;
      dy += ((y - canvasHeight / 2) / distanceFromBorder) * force;

      dy += this.random.floatBetween(-1, 1);
      dx += this.random.floatBetween(-1, 1);
      // Update node position
      let [newX, newY] = [x + dx, y + dy];
      newX = Math.max(this.radius, Math.min(newX, canvasWidth - this.radius));
      newY = Math.max(this.radius, Math.min(newY, canvasHeight - this.radius));
      newPositions.push([newX, newY]);
    }

    const nodes = this.graph.getNodes();
    for (let i = 0; i < newPositions.length; i++) {
      const node = nodes[i];
      node.position = newPositions[i];
    }
  }

  public start(iterations = 1) {
    for (let i = 0; i < iterations; i++) {
      this.updateNodesPosition();
    }
    this.draw();
    this.renderHandler = requestAnimationFrame(() => this.renderLoop());
  }

  public stop() {
    cancelAnimationFrame(this.renderHandler as number);
  }

  private async renderLoop() {
    this.updateNodesPosition();
    this.draw();
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.renderHandler = requestAnimationFrame(() => this.renderLoop());
  }

  public setGraph(graph: Graph<T>) {
    this.graph = graph;
  }
}
