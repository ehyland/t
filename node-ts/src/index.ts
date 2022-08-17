export type Node = {
  label: string;
  children: Node[];
};

export function printTree(tree: Node): string {
  return [tree.label, ...tree.children.map(printTree)].join(', ');
}
