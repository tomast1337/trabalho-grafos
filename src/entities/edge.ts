import { GNode } from "./node";

export interface Edge<T> {
  node1: GNode<T>;
  node2: GNode<T>;
  weight: number;
  color?: string;
}