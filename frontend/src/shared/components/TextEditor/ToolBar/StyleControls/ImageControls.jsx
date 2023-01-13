import { AtomicBlockUtils } from "draft-js";

const ImageControls = (props) => {
  const { editorState, onChange } = props;

  const addImageHandler = (src, height, width) => {
    const entityData = { src, height, width };
    const currentContent = editorState.getCurrentContent();
    currentContent.createEntity("IMAGE", "MUTABLE", entityData);
    const entityKey = currentContent.getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      " "
    );
    onChange(newEditorState);
  };

  return { addImageHandler };
};

export default ImageControls;
