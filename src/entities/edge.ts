import { GNode } from "./node";

export interface Edge<T> {
  node1: GNode<T>;
  node2: GNode<T>;
  weight: number;
}

export const example = () => {
  const edge: Edge<string> = {
    node1: new GNode("A"),
    node2: new GNode("B"),
    weight: 10,
  };
};
