const useCombinedRefs = (...refs) => {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        return ref(node);
      } else {
        ref.current = node;
      }
    });
  };
};

export default useCombinedRefs;
