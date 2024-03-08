import { coerceTruthyValueToArray } from '@/utils/util';
import Node from './node';

const flatNodes = (data, leafOnly) => {
  return data.reduce((res, node) => {
    let localRes = res;
    if (node.isLeaf) {
      localRes.push(node);
    } else {
      !leafOnly && localRes.push(node);
      localRes = localRes.concat(flatNodes(node.children, leafOnly));
    }
    return localRes;
  }, []);
};

export default class Store {
  constructor(data, config) {
    this.config = config;
    this.initNodes(data);
  }

  initNodes(data) {
    let localData = data;
    localData = coerceTruthyValueToArray(localData);
    this.nodes = localData.map((nodeData) => new Node(nodeData, this.config));
    this.flattedNodes = this.getFlattedNodes(false, false);
    this.leafNodes = this.getFlattedNodes(true, false);
  }

  appendNode(nodeData, parentNode) {
    const node = new Node(nodeData, this.config, parentNode);
    const children = parentNode ? parentNode.children : this.nodes;

    children.push(node);
  }

  appendNodes(nodeDataList, parentNode) {
    let nodeDataListR = nodeDataList;
    nodeDataListR = coerceTruthyValueToArray(nodeDataListR);
    nodeDataListR.forEach((nodeData) => this.appendNode(nodeData, parentNode));
  }

  getNodes() {
    return this.nodes;
  }

  getFlattedNodes(leafOnly, cached = true) {
    const cachedNodes = leafOnly ? this.leafNodes : this.flattedNodes;
    return cached
      ? cachedNodes
      : flatNodes(this.nodes, leafOnly);
  }
}
