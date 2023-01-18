import { AtomicBlockUtils, EditorState } from "draft-js";

const ImageControls = (props) => {
  const { editorState, onChange } = props;

  const addImageHandler = (src, height, width) => {
    const entityData = {
      src: src,
      height: height ? height : "100%",
      width: width ? width : "100%",
    };
    
    const currentContent = editorState.getCurrentContent();
    const contentStateWithEntity = currentContent.createEntity(
      "IMAGE",
      "MUTABLE",
      entityData
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
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
//reference:https://stackoverflow.com/questions/50305188/how-to-insert-an-image-using-draft-js