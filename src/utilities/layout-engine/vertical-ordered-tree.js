// eslint-disable-next-line flowtype/no-types-missing-file-annotation
import { type INode } from '../../components/node';
import SnapToGrid from './snap-to-grid';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

class VerticalOrderedTree extends SnapToGrid {
  // eslint-disable-next-line flowtype/no-types-missing-file-annotation
  async adjustNodes(nodes: INode[], nodesMap?: any): INode[] {
    const {
      nodeKey,
      nodeSize,
      nodeHeight,
      nodeWidth,
      nodeSpacingMultiplier,
    } = this.graphViewProps;

    const graph = {
      id: 'root',
      children: [],
      edges: [],
      layoutOptions: {
        'elk.direction': 'DOWN',
        'elk.algorithm': 'layered',
        considerModelOrder: 'NODES_AND_EDGES',
        favorStraightEdges: false,
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      },
    };

    const spacing = nodeSpacingMultiplier || 1.5;
    const size = (nodeSize || 1) * spacing;
    let height;
    let width;

    if (nodeHeight) {
      height = nodeHeight * spacing;
    }

    if (nodeWidth) {
      width = nodeWidth * spacing;
    }

    // TODO possibly modify depending on node IDs
    nodes.sort(({ id }) => id);

    nodes.forEach(node => {
      if (!nodesMap) {
        return;
      }

      const nodeId = node[nodeKey];
      const nodeKeyId = `key-${nodeId}`;
      const nodesMapNode = nodesMap[nodeKeyId];

      if (
        nodesMapNode.incomingEdges.length === 0 &&
        nodesMapNode.outgoingEdges.length === 0
      ) {
        return;
      }

      graph.children.push({
        id: nodeKeyId,
        width: width || size,
        height: height || size,
      });

      /*
      const outgoingEdges = nodesMapNode.outgoingEdges;
      // Need to modify this, currently the target IDs aren't consistently identifying the "adding" node
      outgoingEdges.sort(edge => {
        return parseInt(edge.target.replace(/^\D+/g, ''), 10);
      });
*/

      nodesMapNode.outgoingEdges.forEach(edge => {
        graph.edges.push({
          id: `nodeKeyId-key-${edge.target}`,
          sources: [nodeKeyId],
          targets: [`key-${edge.target}`],
        });
      });
    });

    const result = await elk.layout(graph);

    result.children.forEach(({ id, x, y }) => {
      const nodesMapNode = nodesMap[id];

      nodesMapNode.node.x = x;
      nodesMapNode.node.y = y;
    });

    return nodes;
  }
}

export default VerticalOrderedTree;
