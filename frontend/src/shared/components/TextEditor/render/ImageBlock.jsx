const ImageBlock = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src, height, width } = entity.getData();
  const type = entity.getType();

  let image;
  if (type === "IMAGE") {
    image = (
      <img src={src} alt="post-img" style={{ height: height, width, width }} />
    );
  }

  return image;
};

export default ImageBlock;
