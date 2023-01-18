import ImageBlock from "./ImageBlock";

const blockRendererFn = (block) => {
  if (block.getType() === "atomic") {
    return {
      component: ImageBlock,
      editable: false,
    };
  }
  return null;
};

export default blockRendererFn;
