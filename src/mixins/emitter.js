function broadcast(componentName, eventName, params) {
  this.$children.forEach((child) => {
    const name = child.$options.componentName || child.$options.name;

    if (name === componentName) {
      child.$emit(...[eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let { name } = parent.$options;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          ({ name } = parent.$options);
        }
      }
      if (parent) {
        parent.$emit(...[eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
