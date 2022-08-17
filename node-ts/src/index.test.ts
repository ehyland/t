import { Node, printTree } from '.';

describe('printTree()', () => {
  describe('with a leaf node', () => {
    const tree: Node = {
      label: 'a',
      children: [],
    };

    it('returns just the leaf nodes label', () => {
      expect(printTree(tree)).toEqual('a');
    });
  });

  describe('with a nested tree structure', () => {
    const tree: Node = {
      label: 'a',
      children: [
        {
          label: 'b',
          children: [
            { label: 'c', children: [] },
            { label: 'd', children: [] },
          ],
        },
        { label: 'e', children: [] },
      ],
    };

    it('prints the tree in depth first order', () => {
      expect(printTree(tree)).toEqual('a, b, c, d, e');
    });
  });
});
