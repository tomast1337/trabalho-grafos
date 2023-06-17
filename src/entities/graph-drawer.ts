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

  constructor(graph: Graph<T>, canvas: HTMLCanvasElement, seed = "seed") {
    this.graph = graph;
    this.canvas = canvas;
    this.rc = rough.canvas(this.canvas);
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.random = create(seed);
    for (const node of this.graph.getNodes()) {
      node.position = [
        this.random.intBetween(this.radius * 2, 500 - this.radius * 2),
        this.random.intBetween(this.radius * 2, 500 - this.radius * 2),
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
    rc.line(x1, y1, x2, y2, { roughness: 0.5, stroke: color });
    const [dx, dy] = [x2 - x1, y2 - y1];
    const [d, theta] = [Math.sqrt(dx * dx + dy * dy), Math.atan2(dy, dx)];
    const [x, y] = [
      x1 + (Math.cos(theta) * d) / 2,
      y1 + (Math.sin(theta) * d) / 2,
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
    const newPositions = [] as Array<[number, number]>;
    for (const node of this.graph.getNodes()) {
      // get all neighbors position
      const neighbors = node.getNeighbors();
      const neighborsPosition = neighbors.map((neighbor) => {
        return neighbor.position || [0, 0];
      });
      // calculate a new position, moving towards the average of the neighbors, with a random offset, and mantaining a distance of 2 * radius
      const [x, y] = node.position || [0, 0];
      const [x1, y1] = neighborsPosition.reduce(
        (acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]],
        [0, 0]
      );
      const [x2, y2] = [
        x1 / neighborsPosition.length,
        y1 / neighborsPosition.length,
      ];
      const [dx, dy] = [x2 - x, y2 - y];
      const [d, theta] = [Math.sqrt(dx * dx + dy * dy), Math.atan2(dy, dx)];
      let [newX, newY] = [x + Math.cos(theta) * d, y + Math.sin(theta) * d];
      const [randX, randY] = [
        this.random.intBetween(-10, 10),
        this.random.intBetween(-10, 10),
      ];
      [newX, newY] = [newX + randX, newY + randY];
      if (newX > 500) {
        newX = 500;
      }
      if (newX < 0) {
        newX = 0;
      }
      if (newY > 500) {
        newY = 500;
      }
      if (newY < 0) {
        newY = 0;
      }
      // check if the new position is too close to another node
      for (const [x, y] of newPositions) {
        const [dx, dy] = [newX - x, newY - y];
        const [d, theta] = [Math.sqrt(dx * dx + dy * dy), Math.atan2(dy, dx)];
        if (d < this.radius * 3) {
          [newX, newY] = [
            x + Math.cos(theta) * this.radius * 2,
            y + Math.sin(theta) * this.radius * 2,
          ];
        }
      }

      const [finalX, finalY] = [newX, newY];
      newPositions.push([finalX, finalY]);
    }
    for (let i = 0; i < newPositions.length; i++) {
      const node = this.graph.getNodes()[i];
      node.position = newPositions[i];
    }
  }

  public start(iterations = 1) {
    for (let i = 0; i < iterations; i++) {
      this.updateNodesPosition();
    }
    this.draw();
  }
}
