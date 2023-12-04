if (!Object.groupBy) {
  Object.defineProperty(Object, "groupBy", {
    value: function (items, callbackFn) {
      const grouped = {};
      for (let i = 0; i < items.length; i++) {
        const element = items[i];
        const key = callbackFn(element, i);
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(element);
      }
      return grouped;
    },
    writable: true,
    configurable: true,
  });
}

export default Object.groupBy;
