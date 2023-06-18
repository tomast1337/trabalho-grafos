import { Graph } from "./graph";

export class FruchtermanReingold<T> {
  private graph: Graph<T>;
  private area: number;
  private k: number;
  private iterations: number;
  private width: number;
  private height: number;
  private temperature: number;
  private coolDownStep: number;

  constructor(graph: Graph<T>, width: number, height: number) {
    this.graph = graph;
    this.area = width * height;
    this.k = Math.sqrt(this.area / this.graph.getNodes().length);
    this.width = width;
    this.height = height;
    this.temperature = width / 1000;
    this.coolDownStep = this.temperature / 100;

    for (const node of this.graph.getNodes()) {
      node.position = [Math.random() * this.width, Math.random() * this.height];
    }
  }

  private calculateRepulsiveForce(distance: number): number {
    return (this.k * this.k) / distance;
  }

  private calculateAttractiveForce(distance: number, weight: number): number {
    return ((distance * distance) / this.k) * weight;
  }

  private calculateDisplacement(
    position1: [number, number],
    position2: [number, number],
    distance: number,
    weight: number
  ): [number, number] {
    const delta = [position2[0] - position1[0], position2[1] - position1[1]];

    const displacement = [
      (delta[0] / distance) * this.calculateAttractiveForce(distance, weight),
      (delta[1] / distance) * this.calculateAttractiveForce(distance, weight),
    ] as [number, number];

    return displacement;
  }

  private updateNodePositions(): void {
    this.graph.getNodes().forEach((node) => {
      if (node.position) {
        const [x, y] = node.position;

        const displacement = [0, 0];

        this.graph.getNodes().forEach((otherNode) => {
          if (otherNode !== node && otherNode.position) {
            const [otherX, otherY] = otherNode.position;
            const delta = {
              x: x - otherX,
              y: y - otherY,
            };

            const distance = Math.max(
              0.01,
              Math.sqrt(delta.x * delta.x + delta.y * delta.y)
            );

            if (distance > 200) {
              const force = this.calculateDisplacement(
                node.position as [number, number],
                otherNode.position,
                distance,
                1
              );

              displacement[0] += force[0];
              displacement[1] += force[1];
            } else {
              // Nodes are at the same position, apply repulsive force
              const repulsiveForce = this.calculateRepulsiveForce(distance);
              const angle = Math.random() * 2 * Math.PI;
              displacement[0] += Math.cos(angle) * repulsiveForce * 2;
              displacement[1] += Math.sin(angle) * repulsiveForce * 2;
            }
          }
        });

        const deltaLength = Math.max(
          0.01,
          Math.sqrt(
            displacement[0] * displacement[0] +
              displacement[1] * displacement[1]
          )
        );
        const displacementX =
          (displacement[0] / deltaLength) *
          Math.min(deltaLength, this.temperature);
        const displacementY =
          (displacement[1] / deltaLength) *
          Math.min(deltaLength, this.temperature);

        node.position[0] += displacementX;
        node.position[1] += displacementY;
      }
    });
  }

  private coolDown(): void {
    this.temperature -= this.coolDownStep;
    this.temperature = Math.max(0, this.temperature);
  }

  public layout(): void {
    // Randomly initialize node positions within the given width and height
    this.graph.getNodes().forEach((node) => {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      node.position = [x, y];
    });
  }

  public updateNodesPosition(): void {
    this.updateNodePositions();
    this.coolDown();
  }
}
