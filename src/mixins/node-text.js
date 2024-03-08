export default {
  methods: {
    getSlotTextContent(node) {
      return Array.isArray(node) && node?.map((childNode) => (childNode.children
        ? this.getSlotTextContent(childNode.children)
        : childNode.text)).join('').trim();
    }
  }
};
